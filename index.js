const filter = require('./filter');
const sort = require('./sort');

function getThumbs({ thumbs, args = { start: 0 } }) {
  const filteredItems = filter(args, thumbs);
  const sortedFilteredItems = sort(filteredItems, args.sort);
  return sortedFilteredItems.slice(args.start, args.sortLimit);
}

module.exports = getThumbs;
