const filter = require('./filter');
const query = require('./query');
const sort = require('./sort');

async function getThumbs({ request, videoId, args, fields = [], diff }) {
  const items = await query(request, videoId, args, fields);
  const filteredItems = filter(args, items);
  const ids = diff ? filteredItems.map(it => it.id) : [];
  const finalItems = diff ? items.map(it => !ids.includes(it.id) ? ({ ...it, notFound: true }): it) : filteredItems;
  const sortedFilteredItems = diff ? finalItems : sort(finalItems, args.sort);
  return sortedFilteredItems.slice(args.start || 0, args.sortLimit || undefined);
}

module.exports = getThumbs;
