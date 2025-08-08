const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const { testBlogs } = require('./test_helper')

describe('most likes', () => {
    test('of the list is the one with most likes', () => {
        const result = listHelper.mostLikes(testBlogs)
        assert.deepStrictEqual(result, {
            author: "Edsger W. Dijkstra",
            likes: 17
        })
    })
})