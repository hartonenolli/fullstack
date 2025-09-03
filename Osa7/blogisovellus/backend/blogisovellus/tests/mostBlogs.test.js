const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const { testBlogs } = require('./test_helper')

test('test how many blogs', () => {
    const result = listHelper.mostBlogs(testBlogs)
    assert.strictEqual(result.author, 'Robert C. Martin')
    assert.strictEqual(result.blogs, 3)
})
