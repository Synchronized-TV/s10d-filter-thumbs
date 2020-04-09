const filter = require('./filter');
const query = require('./query');

async function getThumbs(request, videoId, args) {
  const items = await query(request, videoId, args);
  return filter(args, items);
}

module.exports = getThumbs;
