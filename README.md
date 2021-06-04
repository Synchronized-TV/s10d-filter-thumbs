# s10d-filter-thumbs

Filters and sorts a list of thumbs

## Usage

```js
const filterThumbs = require('s10d-filter-thumbs');

const thumbs = [
  {
    biggestFace: {
      height: 0.5,
      width: 0.5
    }
  },
  {
    biggestFace: {
      height: 0.2,
      width: 0.2
    }
  }
];

const args = {
  where: {
    biggestFace_gt: 0.3
  },
  sort: [
    {
      path: '$.biggestFace',
      direction: 'ASC'
    }
  ]
};

const thumbs = filterThumbs({ thumbs, args });
```
