const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('test how many blogs', () => {
    const result = listHelper.mostBlogs(listHelper.testBlogs)
    assert.strictEqual(result.author, 'Robert C. Martin')
    assert.strictEqual(result.blogs, 3)
})
