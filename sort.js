const sortBy = require('lodash.sortby');
const jsonpath = require('jsonpath');
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

function injectScores(thumbs, sort) {
  const thumbsWithOccurences = thumbs.map(thumb => ({
    ...thumb,
    ...Object.keys(thumb)
      .filter(key => Array.isArray(thumb[key]))
      .reduce((acc, key) => {
        const occurences = getOccurences(thumbs, key, 'name');

        return {
          ...acc,
          [key]: thumb[key].map(it => ({
            ...it,
            occurences: occurences[it.name]
          }))
        };
      }, {})
  }));

  const thumbsWithRawScore = thumbsWithOccurences.map(thumb => ({
    ...thumb,
    ...sort.reduce((acc, { path, center }) => {
      const values = []
        .concat(jsonpath.query(thumb, path))
        .map(it => center !== undefined ? Math.abs(it - center) : it);

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

  const thumbsWithScore = thumbsWithRawScore.map(thumb => ({
    ...thumb,
    ...sort.reduce((acc, { path }) => {
      const rawScore = thumbsWithRawScore
        .map(it => it.rawScore[path])
        .filter(it => !Number.isNaN(it));
      const minRawScore = Math.min.apply(null, rawScore);
      const maxRawScore = Math.max.apply(null, rawScore);
      const max = maxRawScore - minRawScore;
      const score = (thumb.rawScore[path] - minRawScore) / max;

      return {
        ...acc,
        score: {
          ...acc.score,
          [path]: Number.isNaN(score) ? 0 : score
        }
      };
    }, {})
  }));

  return thumbsWithScore;
}

function getAverageScore(thumb, sort) {
  return (
    sort.reduce((acc, { path, direction = 'DESC', weight = 1, negative }) => {
      const value = thumb.score[path];
      const finalValue = negative ? 0 - value : value;

      return acc + (direction === 'ASC' ? 1 - finalValue : finalValue) * weight;
    }, 0) / sort.reduce((acc, { weight = 1 }) => acc + weight, 0)
  );
}

function sortThumbs(thumbs, sort) {
  if (!sort) {
    return thumbs;
  }

  const thumbsWithScore = injectScores(
    // Wrap jsonpath obj to work with objects having weird prototype.
    thumbs.map(thumb => JSON.parse(JSON.stringify(thumb))),
    sort
  );

  return sortBy(
    thumbsWithScore.map(thumb => ({
      ...thumb,
      score: {
        ...thumb.score,
        average: getAverageScore(thumb, sort)
      }
    })),
    it => it.score.average
  ).reverse();
}

module.exports = sortThumbs;
