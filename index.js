const filter = require('./filter');
const query = require('./query');
const sort = require('./sort');

async function getThumbs({ request, videoId, args, fields = [], diff }) {
  console.time('query');
  const items = await query(request, videoId, args, fields);
  console.timeEnd('query');
  console.time('filter');
  const filteredItems = filter(args, items);
  console.timeEnd('filter');
  const ids = diff ? filteredItems.map(it => it.id) : [];
  const finalItems = diff ? items.map(it => !ids.includes(it.id) ? ({ ...it, notFound: true }): it) : filteredItems;
  console.time('sort');
  const sortedFilteredItems = diff ? finalItems : sort(finalItems, args.sort);
  console.timeEnd('sort');
  return sortedFilteredItems.slice(args.start || 0, args.sortLimit || undefined);
}

module.exports = getThumbs;
