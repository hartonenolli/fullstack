const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const { testBlogs } = require('./test_helper')

const mostLikes = () => {
  return listHelper.favoriteBlog(testBlogs)
}

describe('favorite blog', () => {
  test('of the list is the one with most likes', () => {
    const result = mostLikes()
    assert.strictEqual(result.title, 'Canonical string reduction')
    assert.strictEqual(result.author, 'Edsger W. Dijkstra')
    assert.strictEqual(result.likes, 12)
  })
})
