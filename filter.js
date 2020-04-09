require('@babel/register');
require('@babel/polyfill');

const { mongo } = require('json-criteria');

const conditions = {
  $every (d, q) {
    try {
      return Array.isArray(d) && d.every((e) => this.test(e, q));
    } catch (e) {
      return false;
    }
  },

  $none(d, q) {
    try {
      return Array.isArray(d) && d.every((e) => !this.test(e, q));
    } catch (e) {
      return false;
    }
  },

  $some(d, q) {
    try {
      return Array.isArray(d) && d.some((e) => this.test(e, q));
    } catch (e) {
      return false;
    }
  }
};

mongo.registry.conditions = mongo.registry.conditions.concat(Object.entries(conditions));

function transform(part, value) {
  const [name, ...rest] = part.split('_');
  const op = part.includes('_') ? rest.join('_') : part;

  switch (op) {
    case 'NOT':
      return ['$not', value];
    case 'OR':
      return ['$or', [].concat(value)];
    case 'AND':
      return ['$and', [].concat(value)];
    case 'gte':
    case 'lte':
    case 'gt':
    case 'lt':
    case 'some':
    case 'every':
    case 'none':
      return [name, { [`$${op}`]: value }];
    case 'in':
      return [name, { '$in': [].concat(value) }];
    case 'not':
      return [name, { '$ne': value }];
    case 'not_in':
      return [name, { '$nin': [].concat(value) }];
    default:
      return [part, value];
  }
}

function convert(variables) {
  if (Array.isArray(variables)) {
    return variables.map(convert);
  }

  if (typeof variables !== 'object' || variables === undefined || variables === null) {
    return variables;
  }

  return Object.entries(variables).map(([key, value]) => {
    return transform(key, convert(value));
  }).reduce((acc, [key, value]) => {
    if (Array.isArray(value)) {
      return {
        ...acc,
        [key]: [
          ...acc[key] || [],
          ...value
        ]
      }
    }

    if (typeof value === 'object' && value !== null) {
      return {
        ...acc,
        [key]: {
          ...acc[key] || {},
          ...value
        }
      }
    }

    return {
      ...acc,
      [key]: value
    }
  }, {});
}

function filter(args, items = []) {
  const { where } = args;

  if (!items || !items.length) {
    return [];
  }

  return Object.keys(where).length === 0 ? items : items.filter(item => mongo.test(item, convert(where)));
}

module.exports = filter;
