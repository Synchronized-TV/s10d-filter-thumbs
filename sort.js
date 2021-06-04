const sortBy = require('lodash.sortby');
const jsonpath = require('jsonpath-faster');
const moize = require('moize').default;

const getOccurences = moize((arr, key, fieldName) => {
  const values = arr.reduce(
    (acc, it) => acc.concat((it[key] || []).map(f => f[fieldName])),
    []
  );

  return values.reduce((acc, it) => {
    const nextAcc = { ...acc };
    nextAcc[it] = (nextAcc[it] || 0) + 1;

    return nextAcc;
  }, {});
});

function injectScores(items, sort) {
  const itemsWithOccurences = items.map(item => ({
    ...item,
    ...Object.keys(item)
      .filter(key => Array.isArray(item[key]))
      .reduce((acc, key) => {
        const occurences = getOccurences(items, key, 'name');

        return {
          ...acc,
          [key]: item[key].map(it => ({
            ...it,
            occurences: occurences[it.name]
          }))
        };
      }, {})
  }));

  const itemsWithRawScore = itemsWithOccurences.map(item => ({
    ...item,
    ...sort.reduce((acc, { path, center }) => {
      const values = []
        .concat(jsonpath.query(item, path))
        .map(it => (center !== undefined ? Math.abs(it - center) : it));

      const rawScore = values.reduce(
        (a, b) => a + (Number.isNaN(b) ? 0 : b),
        0
      );

      return {
        ...acc,
        rawScore: {
          ...acc.rawScore,
          [path]: rawScore
        }
      };
    }, {})
  }));

  const itemsWithScore = itemsWithRawScore.map(item => ({
    ...item,
    ...sort.reduce((acc, { path }) => {
      const rawScore = itemsWithRawScore
        .map(it => it.rawScore[path])
        .filter(it => !Number.isNaN(it));
      const minRawScore = Math.min.apply(null, rawScore);
      const maxRawScore = Math.max.apply(null, rawScore);
      const max = maxRawScore - minRawScore;
      const score = (item.rawScore[path] - minRawScore) / max;

      return {
        ...acc,
        score: {
          ...acc.score,
          [path]: Number.isNaN(score) ? 0 : score
        }
      };
    }, {})
  }));

  return itemsWithScore;
}

function getAverageScore(item, sort) {
  return (
    sort.reduce((acc, { path, direction = 'DESC', weight = 1, negative }) => {
      const value = item.score[path];
      const finalValue = negative ? 0 - value : value;

      return acc + (direction === 'ASC' ? 1 - finalValue : finalValue) * weight;
    }, 0) / sort.reduce((acc, { weight = 1 }) => acc + weight, 0)
  );
}

function sortItems(sort, items = []) {
  if (!items || !items.length) {
    return [];
  }

  if (!sort) {
    return items;
  }

  const itemsWithScore = injectScores(items, sort);

  return sortBy(
    itemsWithScore.map(item => ({
      ...item,
      score: {
        ...item.score,
        average: getAverageScore(item, sort)
      }
    })),
    it => it.score.average
  )
    .reverse()
    .map(({ score, rawScore, ...it }) => it);
}

module.exports = sortItems;
