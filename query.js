
const { makeThumbsQuery, THUMBS_CONNECTION } = require('./graphql');

const thumbFields = [
  'start',
  'end',
  'url',
  'brightness',
  'sharpness',
  'quality',
  'facesCount',
  'faces',
  'biggestFace',
  'secondBiggestFace',
  'thirdBiggestFace',
  'matches',
  'celebrities',
  'labels',
  'texts'
];

async function query(request, videoId, args, length = 500) {
  const { thumbsConnection: { aggregate: { count } } } = await request(THUMBS_CONNECTION, {
    where: {
      video: {
        id: videoId
      }
    }
  });

  const JSONArgs = JSON.stringify(args);
  const filteredFields = thumbFields.filter(thumbField => JSONArgs.includes(thumbField));

  const chunks = await Promise.all(Array.from({ length: Math.ceil(count / length) }).map((_, i) => {
    return request(makeThumbsQuery(filteredFields), {
      skip: i * length,
      first: length,
      where: {
        video: {
          id: videoId
        }
      }
    })
  }));

  return chunks.reduce((acc, { thumbs }) => [...acc, ...thumbs], []);
}

module.exports = query;
