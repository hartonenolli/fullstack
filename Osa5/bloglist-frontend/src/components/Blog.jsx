import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, handleLike, handleDelete }) => {
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


  return (
    <form>
      <div style={blogStyle} className='blog'>
        <div>
          {blog.title}
          <button type="button" onClick={() => setShowDetails(!showDetails)}>
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
