const express = require('express')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const { MONGODB_URI, PORT } = require('./utils/config')

logger.info('Connecting to MongoDB...')
logger.info(`MongoDB URI: ${MONGODB_URI}`)
logger.error('This is an error message for testing purposes.')

const app = express()

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

const Blog = mongoose.model('Blog', blogSchema)

const mongoUrl = process.env.MONGODB_URI
mongoose.connect(mongoUrl)

app.use(express.json())

app.get('/', (request, response) => {
    response.send('<h1>Welcome to the Blog List API</h1>')
})

app.get('/api/blogs', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog.save().then((result) => {
    response.status(201).json(result)
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})