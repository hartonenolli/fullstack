const blogsRouter = require('express').Router()
const { request, response } = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { userExtractor } = require('../utils/middleware')
const { default: blogs } = require('../../../frontend/bloglist-frontend/src/services/blogs')

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

blogsRouter.post('/', userExtractor, async (request, response, next) => {
    const body = request.body
    const user = request.user

    if (!body.title || !body.url) {
        const err = new Error('Title and URL are required fields')
        err.name = 'ValidationError'
        return next(err)
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

blogsRouter.delete('/:id', userExtractor, async (request, response, next) => {
    const user = request.user
    if (!user) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
        return response.status(404).json({ error: 'Blog not found' })
    }
    if (blog.user.toString() !== user.id) {
        return response.status(403).json({ error: 'You do not have permission to delete this blog' })
    }
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

    blogsRouter.post('/:id/comments', async (request, response, next) => {
        const { comment } = request.body
        if (!comment) {
            return response.status(400).json({ error: 'Comment is required' })
        }
        try {
            const blog = await Blog.findById(request.params.id)
            if (blog) {
                blog.comments = blog.comments.concat(comment)
                const updatedBlog = await blog.save()
                response.status(201).json(updatedBlog)
            } else {
                response.status(404).json({ error: 'Blog not found' })
            }
        } catch (exception) {
            next(exception)
        }
    })

module.exports = blogsRouter