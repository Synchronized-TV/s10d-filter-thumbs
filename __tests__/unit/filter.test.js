const filter = require('../../filter');

describe('filter', () => {
  it('should return empty array if no items', async () => {
    const result = filter({});

    expect(result).toEqual([]);
  });

  it('should return items if no where', async () => {
    const items = [
      {
        a: 10
      }
    ];

    const result = filter({}, items);

    expect(result).toEqual(items);
  });

  it('should filter items', async () => {
    const items = [
      {
        a: 10
      },
      {
        a: 20
      },
      {
        a: 30
      }
    ];

    const result = filter(
      {
        a: 10
      },
      items
    );

    expect(result).toStrictEqual([
      {
        a: 10
      }
    ]);
  });

  it('should filter gt items', async () => {
    const items = [
      {
        a: 10
      },
      {
        a: 20
      },
      {
        a: 30
      }
    ];

    const result = filter(
      {
        a_gt: 15
      },
      items
    );

    expect(result).toStrictEqual([
      {
        a: 20
      },
      {
        a: 30
      }
    ]);
  });

  it('should filter gte items', async () => {
    const items = [
      {
        a: 10
      },
      {
        a: 20
      },
      {
        a: 30
      }
    ];

    const result = filter(
      {
        a_gte: 20
      },
      items
    );

    expect(result).toStrictEqual([
      {
        a: 20
      },
      {
        a: 30
      }
    ]);
  });

  it('should filter lt items', async () => {
    const items = [
      {
        a: 10
      },
      {
        a: 20
      },
      {
        a: 30
      }
    ];

    const result = filter(
      {
        a_lt: 20
      },
      items
    );

    expect(result).toStrictEqual([
      {
        a: 10
      }
    ]);
  });

  it('should filter lte items', async () => {
    const items = [
      {
        a: 10
      },
      {
        a: 20
      },
      {
        a: 30
      }
    ];

    const result = filter(
      {
        a_lte: 20
      },
      items
    );

    expect(result).toStrictEqual([
      {
        a: 10
      },
      {
        a: 20
      }
    ]);
  });

  it('should filter contains items', async () => {
    const items = [
      {
        a: 'test'
      },
      {
        a: 'hello'
      },
      {
        a: 'yep'
      }
    ];

    const result = filter(
      {
        a_contains: 'ello'
      },
      items
    );

    expect(result).toStrictEqual([
      {
        a: 'hello'
      }
    ]);
  });

  it('should filter starts_with items', async () => {
    const items = [
      {
        a: 'test'
      },
      {
        a: 'hello'
      },
      {
        a: 'yep'
      }
    ];

    const result = filter(
      {
        a_starts_with: 'hel'
      },
      items
    );

    expect(result).toStrictEqual([
      {
        a: 'hello'
      }
    ]);
  });

  it('should filter ends_with items', async () => {
    const items = [
      {
        a: 'test'
      },
      {
        a: 'hello'
      },
      {
        a: 'yep'
      }
    ];

    const result = filter(
      {
        a_ends_with: 'lo'
      },
      items
    );

    expect(result).toStrictEqual([
      {
        a: 'hello'
      }
    ]);
  });

  it('should filter if a key does not exist', async () => {
    const items = [
      {
        a: 10
      },
      {
        a: 20
      },
      {
        a: 30
      }
    ];

    const result = filter(
      {
        x_gt: 15
      },
      items
    );

    expect(result).toStrictEqual([]);
  });

  it('should filter deep items', async () => {
    const items = [
      {
        a: {
          b: 10
        }
      },
      {
        a: {
          b: 20
        }
      },
      {
        a: {
          b: 30
        }
      }
    ];

    const result = filter(
      {
        a: {
          b_gt: 15
        }
      },
      items
    );

    expect(result).toStrictEqual([
      {
        a: {
          b: 20
        }
      },
      {
        a: {
          b: 30
        }
      }
    ]);
  });

  it('should filter some array items', async () => {
    const items = [
      {
        a: [
          {
            b: 10
          },
          {
            b: 10
          }
        ]
      },
      {
        a: [
          {
            b: 20
          },
          {
            b: 10
          }
        ]
      },
      {
        a: [
          {
            b: 30
          },
          {
            b: 10
          }
        ]
      }
    ];

    const result = filter(
      {
        a_some: {
          b_gt: 15
        }
      },
      items
    );

    expect(result).toStrictEqual([
      {
        a: [
          {
            b: 20
          },
          {
            b: 10
          }
        ]
      },
      {
        a: [
          {
            b: 30
          },
          {
            b: 10
          }
        ]
      }
    ]);
  });

  it('should filter every array items', async () => {
    const items = [
      {
        a: [
          {
            b: 10
          },
          {
            b: 10
          }
        ]
      },
      {
        a: [
          {
            b: 20
          },
          {
            b: 10
          }
        ]
      },
      {
        a: [
          {
            b: 30
          },
          {
            b: 10
          }
        ]
      }
    ];

    const result = filter(
      {
        a_every: {
          b_lt: 15
        }
      },
      items
    );

    expect(result).toStrictEqual([
      {
        a: [
          {
            b: 10
          },
          {
            b: 10
          }
        ]
      }
    ]);
  });

  it('should filter none array items', async () => {
    const items = [
      {
        a: [
          {
            b: 10
          },
          {
            b: 10
          }
        ]
      },
      {
        a: [
          {
            b: 20
          },
          {
            b: 10
          }
        ]
      },
      {
        a: [
          {
            b: 30
          },
          {
            b: 10
          }
        ]
      }
    ];

    const result = filter(
      {
        a_none: {
          b_gt: 15
        }
      },
      items
    );

    expect(result).toStrictEqual([
      {
        a: [
          {
            b: 10
          },
          {
            b: 10
          }
        ]
      }
    ]);
  });

  it('should filter in array items', async () => {
    const items = [
      {
        a: 'test'
      },
      {
        a: 'hello'
      },
      {
        a: 'yep'
      }
    ];

    const result = filter(
      {
        a_in: ['test', 'other']
      },
      items
    );

    expect(result).toStrictEqual([
      {
        a: 'test'
      }
    ]);
  });

  it('should filter not_in array items', async () => {
    const items = [
      {
        a: 'test'
      },
      {
        a: 'hello'
      },
      {
        a: 'yep'
      }
    ];

    const result = filter(
      {
        a_not_in: ['test', 'other']
      },
      items
    );

    expect(result).toStrictEqual([
      {
        a: 'hello'
      },
      {
        a: 'yep'
      }
    ]);
  });

  it('should filter NOT array items', async () => {
    const items = [
      {
        a: 10
      },
      {
        a: 20
      },
      {
        a: 30
      }
    ];

    const result = filter(
      {
        NOT: {
          a_gt: 20
        }
      },
      items
    );

    expect(result).toStrictEqual([
      {
        a: 10
      },
      {
        a: 20
      }
    ]);
  });

  it('should filter OR array items', async () => {
    const items = [
      {
        a: 10
      },
      {
        a: 20
      },
      {
        a: 30
      }
    ];

    const result = filter(
      {
        OR: [
          {
            a_gt: 25
          },
          {
            a_lt: 15
          }
        ]
      },
      items
    );

    expect(result).toStrictEqual([
      {
        a: 10
      },
      {
        a: 30
      }
    ]);
  });

  it('should filter AND array items', async () => {
    const items = [
      {
        a: 10
      },
      {
        a: 20
      },
      {
        a: 30
      }
    ];

    const result = filter(
      {
        AND: [
          {
            a_gt: 25
          },
          {
            a_lt: 35
          }
        ]
      },
      items
    );

    expect(result).toStrictEqual([
      {
        a: 30
      }
    ]);
  });
});
