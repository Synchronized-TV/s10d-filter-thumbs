
const { makeThumbsQuery, THUMBS_CONNECTION } = require('./graphql');
const { CUE, VIDEO, thumbFields } = require('./graphql');

async function getStartEndFromChapterIdOrVideoId({ request, ...args }) {
  if (args.chapterId) {
    const {
      cue: { start, end, video }
    } = await request(CUE, { id: args.chapterId });

    const {
      chapterStartInc = 0,
      chapterEndInc = 0
    } = video.project.thumbsPresets.find(it => video.title.match(new RegExp(it.videosPath))
    );

    return { video, start: start + chapterStartInc, end: end - chapterEndInc };
  }
  if (args.videoId) {
    const { video } = await request(VIDEO, { id: args.videoId });

    const {
      videoStartInc = 0,
      videoEndInc = 0
    } = video.project.thumbsPresets.find(it => video.title.match(new RegExp(it.videosPath))
    );

    return {
      video,
      start: 0 + videoStartInc,
      end: video.duration - videoEndInc
    };
  }

  throw new Error('No video or chapter id');
}

async function query({ request, videoId, chapterId, args, fields, length = 500 }) {
  const { video, start, end } = await getStartEndFromChapterIdOrVideoId({
    request, videoId, chapterId
  });

  const { thumbsConnection: { aggregate: { count } } } = await request(THUMBS_CONNECTION, {
    where: {
      video: {
        id: video.id
      }
    }
  });

  const JSONArgs = JSON.stringify(args);
  const filteredFields = thumbFields.filter(thumbField => JSONArgs.includes(thumbField)).concat(fields);

  const chunks = await Promise.all(Array.from({ length: Math.ceil(count / length) }).map((_, i) => {
    return request(makeThumbsQuery(filteredFields), {
      skip: i * length,
      first: length,
      where: {
        start_gte: start,
        start_lt: end,  
        video: {
          id: video.id
        }
      }
    })
  }));

  return chunks.reduce((acc, { thumbs }) => [...acc, ...thumbs], []);
}

module.exports = query;
