const blogsRouter = require('express').Router()
const { request, response } = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response, next) => {
    try {
        const blogs = await Blog.find({}).populate('user', {
            username: 1,
            name: 1
        })
        response.json(blogs)
    } catch (exception) {
        next(exception)
    }
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
        response.json(blog)
    } else {
        response.status(404).end()
    }
})

blogsRouter.post('/', async (request, response, next) => {
    const body = request.body
    let user = await User.findById(body.userId)
    console.log('Received POST request with body:', body);

    if (!body.title || !body.url) {
        const err = new Error('Title and URL are required fields')
        err.name = 'ValidationError'
        return next(err)
    }
    if (!user) {
        const firstUser = await User.findOne({})
        if (!firstUser) {
            const err = new Error('No users found in the database')
            err.name = 'ValidationError'
            return next(err)
        }
        user = firstUser
    }

    try {
        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes || 0,
            user: user._id
        })
        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        response.status(201).json(savedBlog)
    } catch (exception) {
        next(exception)
    }
})

blogsRouter.delete('/:id', async (request, response, next) => {
    try {
        const blog = await Blog.findByIdAndDelete(request.params.id)
        if (blog) {
            response.status(204).end()
        } else {
            response.status(404).end()
        }
    } catch (exception) {
        next (exception)
    }
})

blogsRouter.put('/:id', async (request, response, next) => {
    try {
        const { likes } = request.body
        console.log('id', request.params.id);
        const blog = await Blog.findById(request.params.id)
            if (blog) {
                blog.likes = likes
                const updatedBlog = await blog.save()
                if (updatedBlog) {
                    response.json(updatedBlog)
                } else {
                    response.status(404).end()
                }
            } else {
                response.status(404).end()
            }
        } catch (exception) {
            next(exception)
        }
    })

module.exports = blogsRouter
