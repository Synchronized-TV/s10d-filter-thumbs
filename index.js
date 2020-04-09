const filter = require('./filter');
const query = require('./query');
const sort = require('./sort');

async function getThumbs({ request, videoId, args, fields = [] }) {
  const items = await query(request, videoId, args, fields);
  const filteredItems = filter(args, items);
  const sortedFilteredItems = sort(filteredItems, args.sort);
  return sortedFilteredItems.slice(args.start || 0, args.sortLimit || undefined);
}

module.exports = getThumbs;
