const sort = require('../../src/sort');

describe('sort', () => {
  it('should return empty array if no items', async () => {
    const result = sort({});

    expect(result).toEqual([]);
  });

  it('should return items if no sort', async () => {
    const items = [
      {
        a: 10
      }
    ];

    const result = sort(undefined, items);

    expect(result).toEqual(items);
  });

  it('should return sorted items by path', async () => {
    const items = [
      {
        a: 0,
        b: 30
      },
      {
        a: 10,
        b: 20
      }
    ];

    const result = sort(
      [
        {
          path: '$.a'
        }
      ],
      items
    );

    expect(result).toEqual([
      {
        a: 10,
        b: 20
      },
      {
        a: 0,
        b: 30
      }
    ]);
  });

  it('should return sorted items with direction', async () => {
    const items = [
      {
        a: 0,
        b: 30
      },
      {
        a: 10,
        b: 20
      }
    ];

    const result = sort(
      [
        {
          path: '$.a',
          direction: 'DESC'
        }
      ],
      items
    );

    expect(result).toEqual([
      {
        a: 10,
        b: 20
      },
      {
        a: 0,
        b: 30
      }
    ]);
  });

  it('should return sorted items with direction', async () => {
    const items = [
      {
        a: 0,
        b: 30
      },
      {
        a: 10,
        b: 20
      }
    ];

    const result = sort(
      [
        {
          path: '$.a',
          direction: 'ASC'
        }
      ],
      items
    );

    expect(result).toEqual([
      {
        a: 0,
        b: 30
      },
      {
        a: 10,
        b: 20
      }
    ]);
  });

  it('should return sorted items with weight', async () => {
    const items = [
      {
        a: 0,
        b: 30
      },
      {
        a: 10,
        b: 20
      },
      {
        a: 12,
        b: 40
      }
    ];

    const result = sort(
      [
        {
          path: '$.a',
          direction: 'ASC',
          weight: 1
        },
        {
          path: '$.b',
          direction: 'ASC',
          weight: 2
        }
      ],
      items
    );

    expect(result).toEqual([
      {
        a: 10,
        b: 20
      },
      {
        a: 0,
        b: 30
      },
      {
        a: 12,
        b: 40
      }
    ]);
  });

  it('should return sorted items with deep path', async () => {
    const items = [
      {
        a: {
          b: 30
        }
      },
      {
        a: {
          b: 20
        }
      },
      {
        a: {
          b: 40
        }
      }
    ];

    const result = sort(
      [
        {
          path: '$.a.b',
          direction: 'ASC',
          weight: 1
        }
      ],
      items
    );

    expect(result).toEqual([
      {
        a: {
          b: 20
        }
      },
      {
        a: {
          b: 30
        }
      },
      {
        a: {
          b: 40
        }
      }
    ]);
  });

  it('should return sorted items with occurrences', async () => {
    const items = [
      {
        a: [
          {
            name: 'test'
          },
          {
            name: 'test'
          },
          {
            name: 'other'
          }
        ]
      },
      {
        a: [
          {
            name: 'test'
          },
          {
            name: 'other'
          },
          {
            name: 'yop'
          }
        ]
      },
      {
        a: [
          {
            name: 'test'
          },
          {
            name: 'test'
          },
          {
            name: 'test'
          }
        ]
      }
    ];

    const result = sort(
      [
        {
          path: '$.a[*].occurences',
          direction: 'DESC',
          weight: 1
        }
      ],
      items
    );

    expect(result).toEqual([
      {
        a: [
          {
            name: 'test',
            occurences: 6
          },
          {
            name: 'test',
            occurences: 6
          },
          {
            name: 'test',
            occurences: 6
          }
        ]
      },
      {
        a: [
          {
            name: 'test',
            occurences: 6
          },
          {
            name: 'test',
            occurences: 6
          },
          {
            name: 'other',
            occurences: 2
          }
        ]
      },
      {
        a: [
          {
            name: 'test',
            occurences: 6
          },
          {
            name: 'other',
            occurences: 2
          },
          {
            name: 'yop',
            occurences: 1
          }
        ]
      }
    ]);
  });
});
