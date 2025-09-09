import { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { likeBlog, removeBlog } from '../reducers/blogReducer'
import { Link } from 'react-router-dom'

const Blog = ({ blog }) => {
  const dispatch = useDispatch()
  const [showDetails, setShowDetails] = useState(false)
  const user = JSON.parse(window.localStorage.getItem('loggedBlogappUser'))
  console.log('logged in user:', user.username)

  const handleLikeClick = () => {
    dispatch(likeBlog(blog))
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      dispatch(removeBlog(blog.id))
    }
  }

  Blog.propTypes = {
    blog: PropTypes.object.isRequired,
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <form>
      <div style={blogStyle} className="blog">
        <div>
          <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          <button type="button" onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? 'hide' : 'view'}
          </button>
        </div>
        {showDetails && (
          <div>
            <p>{blog.url}</p>
            <p>likes {blog.likes}</p>
            <p>
              <button type="button" onClick={handleLikeClick}>
                like
              </button>
            </p>
            <p>{blog.user.name}</p>
            {user && user.username === blog.user.username && (
              <button type="button" onClick={handleDelete}>
                remove
              </button>
            )}
          </div>
        )}
      </div>
    </form>
  )
}

export default Blog
