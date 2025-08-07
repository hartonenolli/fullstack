import { test, describe } from 'node:test'
import assert from 'node:assert'
import listHelper from '../utils/list_helper.js'

const mostLikes = () => {
  return listHelper.favoriteBlog(listHelper.testBlogs)
}

describe('favorite blog', () => {
  test('of the list is the one with most likes', () => {
    const result = mostLikes()
    assert.strictEqual(result.title, 'Canonical string reduction')
    assert.strictEqual(result.author, 'Edsger W. Dijkstra')
    assert.strictEqual(result.likes, 12)
  })
})
