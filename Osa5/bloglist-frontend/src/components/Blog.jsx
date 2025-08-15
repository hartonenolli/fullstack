import { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const Blog = ({ blog }) => {
  const [showDetails, setShowDetails] = useState(false)
  const user = JSON.parse(window.localStorage.getItem('loggedBlogappUser'))

  Blog.propTypes = {
    blog: PropTypes.object.isRequired
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
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

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      blogService.deleteBlog(blog.id)
        .then(() => {
          console.log(`Blog ${blog.title} deleted`)
        })
        .catch(error => {
          console.error('Error deleting blog:', error)
        })
    }
  }

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  return (
    <form>
      <div style={blogStyle}>
        <div>
          {blog.title}
      <button type="button" onClick={toggleDetails}>
        {showDetails ? 'hide' : 'view'}
      </button>
        </div>
        {showDetails && (
          <div>
            <p>{blog.url}</p>
            <p>likes {blog.likes}</p>
            <p><button type="button" onClick={handleLike}>like</button></p>
            <p>{blog.user.name}</p>
            {user && user.username === blog.user.username && (
              <button type="button" onClick={handleDelete}>remove</button>
            )}
          </div>
        )}
      </div>
    </form>
  )
}

export default Blog
