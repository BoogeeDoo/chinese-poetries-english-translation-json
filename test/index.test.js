'use strict';

const assert = require('assert');

const poetries = require('../');

describe('json', () => {
  it('test json', () => {
    assert.strictEqual(poetries.length, 202);
    assert.deepStrictEqual(poetries[0], {
      url: 'http://www.chinese-poems.com/bj1.html',
      title: 'Night Snow',
      author: 'Bai Juyi',
      content: [
        'I was surprised my quilt and pillow were cold,',
        'I see that now the window\'s bright again.',
        'Deep in the night, I know the snow is thick,',
        'I sometimes hear the sound as bamboo snaps.',
      ],
    });
  });
});
