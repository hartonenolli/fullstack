const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const { testBlogs, testUsers, usersInDb } = require('./test_helper')

const api = supertest(app)

describe('Blog API tests', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(testBlogs)
    await User.deleteMany({})
    await User.insertMany(testUsers)
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
      // First, log in to get a token
      const loginResponse = await api
        .post('/api/login')
        .send({ username: testUsers[0].username, password: 'hashedpassword1' })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const token = loginResponse.body.token
      // console.log('token:', token);

      const newBlog = {
          title: 'Bew Nlog',
          author: 'Dohn Joe',
          url: 'https://example.com/bew-nlog'
      }

      const response = await api
          .post('/api/blogs')
          .set('Authorization', `Bearer ${token}`)
          .send(newBlog)
          .expect(201)
          .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await api.get('/api/blogs')
      assert.strictEqual(blogsAtEnd.body.length, testBlogs.length + 1)
      const titles = blogsAtEnd.body.map(blog => blog.title)
      assert.ok(titles.includes(newBlog.title), 'New blog title not found in the list of blogs')
  })

  test('POST /api/blogs without likes defaults to 0', async () => {
      const loginResponse = await api
        .post('/api/login')
        .send({ username: testUsers[0].username, password: 'hashedpassword1' })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const token = loginResponse.body.token
      const newBlog = {
          title: 'No Likes Blog',
          author: 'No Likes Author',
          url: 'https://example.com/no-likes'
      }
      const response = await api
          .post('/api/blogs')
          .set('Authorization', `Bearer ${token}`)
          .send(newBlog)
          .expect(201)
          .expect('Content-Type', /application\/json/)

      // console.log('response.body:', response.body);
      assert.strictEqual(response.body.likes, 0)
  })
  test('users are returned as json', async () => {
          const response = await api.get('/api/users')
          const users = response.body
  
          assert.strictEqual(response.status, 200)
          assert.strictEqual(Array.isArray(users), true)
          assert.strictEqual(users.length, 2)
          // console.log('users', users);
      })
      test('creation succeeds with a fresh username', async () => {
          const newUser = {
              username: "user3",
              name: "User Three",
              password: "hashedpassword3"
          }
  
          const response = await api
          .post('/api/users')
          .send(newUser)
          .expect(201)
          .expect('Content-Type', /application\/json/)
  
          const usersAtEnd = await usersInDb()
          assert.strictEqual(usersAtEnd.length, testUsers.length + 1)
          const usernames = usersAtEnd.map(user => user.username)
          assert.ok(usernames.includes(newUser.username), 'New user username not found in the list of users')
      })
      test('creation fails with invalid inputs', async () => {
          const badUser1 = {
              username: null,
              name: "No Username",
              password: "NoUsername"
          }
          const badUser2 = {
              username: "NoPassword",
              name: "No Password",
              password: null
          }
          const badUser3 = {
              username: "sh",
              name: "Short Username",
              password: "sh"
          }
  
          const response = await api
          .post('/api/users')
          .send(badUser1)
          .expect(401)
          .expect('Content-Type', /application\/json/)
          const response2 = await api
          .post('/api/users')
          .send(badUser2)
          .expect(401)
          .expect('Content-Type', /application\/json/)
          const response3 = await api
          .post('/api/users')
          .send(badUser3)
          .expect(401)
          .expect('Content-Type', /application\/json/)
      })
      test('creation fails with username, that already exists', async () => {
          newUser = {
              username: testUsers[0].username,
              name: testUsers[0].name,
              password: testUsers[0].passwordHash
          }
          // console.log('newUser', newUser);

          const response = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          // console.log('response status', response.status);
      })
  after(async () => {
      await mongoose.connection.close()
  })
})