const filter = require('./filter');
const sort = require('./sort');

function filterThumbs({ thumbs, args = { start: 0, sortLimit: 100 } }) {
  const filtered = filter(args.where, thumbs);
  const sortedFiltered = sort(args.sort, filtered);
  return sortedFiltered.slice(args.start, args.sortLimit);
}

module.exports = filterThumbs;
