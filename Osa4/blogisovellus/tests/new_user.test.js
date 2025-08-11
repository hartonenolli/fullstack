const assert = require('node:assert')
const { test, describe, beforeEach, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const { usersInDb, testUsers } = require('./test_helper')

const api = supertest(app)

describe('When there are two initial users', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        await User.insertMany(testUsers)
    })
    test('users are returned as json', async () => {
        const response = await api.get('/api/users')
        const users = response.body

        assert.strictEqual(response.status, 200)
        assert.strictEqual(Array.isArray(users), true)
        assert.strictEqual(users.length, 2)
        console.log('users', users);
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
        console.log('newUser', newUser);

        const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        console.log('response status', response.status);
    })
    after(async () => {
        await mongoose.connection.close()
    })
})