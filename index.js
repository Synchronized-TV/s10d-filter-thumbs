const filter = require('./filter');
const query = require('./query');

async function getThumbs(request, videoId, args, fields) {
  const items = await query(request, videoId, args, fields);
  return filter(args, items);
}

module.exports = getThumbs;
