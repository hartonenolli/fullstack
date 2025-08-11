const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', {
        title: 1,
    })
    response.json(users)
})

userRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body
    if (!(username && password)) {
        return response.status(401).json({ error: 'Username and password are required' })
    }
    if (username.length < 3 || password.length < 3) {
        return response.status(401).json({ error: 'Username and password must be at least 3 characters long' })
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const existingUser = await User.findOne({ username })
    if (existingUser) {
        return response.status(400).json({ error: 'Username must be unique' })
    }

    const user = new User({
        username,
        name,
        passwordHash
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)
})

module.exports = userRouter