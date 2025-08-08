const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const { testBlogs } = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(testBlogs)
})

test('GET /api/blogs returns blogs as json and correct amount of blogs', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, testBlogs.length)
})
after(async () => {
  await mongoose.connection.close()
})

test('Blog has key value named id', async () => {
  const response = await api.get('/api/blogs')
  //console.log('response.body:', response.body);
  response.body.forEach(blog => {
    assert.ok(blog.id, 'Blog does not have id field')
  })
})

test('POST /api/blogs creates a new blog', async () => {
    const newBlog = {
        title: 'Bew Nlog',
        author: 'Dohn Joe',
        url: 'https://example.com/bew-nlog'
    }

    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await api.get('/api/blogs')
    assert.strictEqual(blogsAtEnd.body.length, testBlogs.length + 1)
    const titles = blogsAtEnd.body.map(blog => blog.title)
    assert.ok(titles.includes(newBlog.title), 'New blog title not found in the list of blogs')
})

test('POST /api/blogs without likes defaults to 0', async () => {
    const newBlog = {
        title: 'No Likes Blog',
        author: 'No Likes Author',
        url: 'https://example.com/no-likes'
    }
    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    // console.log('response.body:', response.body);
    assert.strictEqual(response.body.likes, 0)
})