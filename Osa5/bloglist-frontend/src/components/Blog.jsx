import React, { useState, useRef, useEffect } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog }) => {
  const [blogsVisible, setBlogsVisible] = useState(false)
  const [buttonLabel, setButtonLabel] = useState('view')
  const handleToggleVisibility = () => {
    setBlogsVisible(!blogsVisible)
    setButtonLabel(blogsVisible ? 'view' : 'hide')
  }
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const handleView = () => {
    handleToggleVisibility()
    blogService.getById(blog.id)
      .then(returnedBlog => {
        // console.log(returnedBlog)
      })
      .catch(error => {
        console.error('Error fetching blog:', error)
      })
  }

  const handleLike = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1
    }
    blogService.like(blog.id, updatedBlog)
      .then(returnedBlog => {
        console.log('Blog liked:', returnedBlog)
      })
      .catch(error => {
        console.error('Error liking blog:', error)
      })
  }

  return (
    <form>
    <div style={blogStyle}>
      <div> 
        {blog.title} {blog.author}
        <button type="button" onClick={handleView}>{buttonLabel}</button>
      </div>
      <div style={{ display: blogsVisible ? '' : 'none' }}>
        <p>{blog.url}</p>
        <p>likes {blog.likes}
        <button type="button" onClick={handleLike}>like</button>
        </p>
        <p>{blog.user.name}</p>
      </div>
    </div>
    </form>
  )
}

export default Blog