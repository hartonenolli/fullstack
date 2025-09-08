import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import { initializeBlogs } from './reducers/blogReducer'
import {
  setNotification,
  clearNotification,
} from './reducers/notificationReducer'
import Togglable from './components/Toggable'
import BlogForm from './components/BlogForm'

const App = () => {
  const dispatch = useDispatch()
  const blogs = useSelector((state) => state.blogs)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const togglableRef = useRef()
  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])
  // useEffect(() => {
  //   blogService.getAll().then((blogs) => setBlogs(blogs))
  // }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.error('Login failed:', exception)
      dispatch(
        setNotification({ message: 'wrong username or password', color: 'red' })
      )
      setTimeout(() => {
        dispatch(clearNotification())
      }, 5000)
    }
  }

  // const handleLike = (blog) => {
  //   const updatedBlog = {
  //     ...blog,
  //     likes: blog.likes + 1,
  //   }
  //   blogService
  //     .like(blog.id, updatedBlog)
  //     .then((returnedBlog) => {
  //       const blogUser = {
  //         ...returnedBlog,
  //         user: blog.user,
  //       }
  //       setBlogs(blogs.map((b) => (b.id !== blog.id ? b : blogUser)))
  //       console.log('Blog liked:', returnedBlog)
  //     })
  //     .catch((error) => {
  //       console.error('Error liking blog:', error)
  //     })
  // }

  // const handleDelete = (blog) => {
  //   if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
  //     blogService
  //       .deleteBlog(blog.id)
  //       .then(() => {
  //         setBlogs(blogs.filter((b) => b.id !== blog.id))
  //         console.log(`Blog ${blog.title} deleted`)
  //       })
  //       .catch((error) => {
  //         console.error('Error deleting blog:', error)
  //       })
  //   }
  // }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          placeholder="username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          placeholder="password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const blogList = () => (
    <div>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          // handleLike={() => handleLike(blog)}
          // handleDelete={() => handleDelete(blog)}
        />
      ))}
    </div>
  )

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      {!user && loginForm()}
      {user && (
        <div>
          <p>
            {user.name} logged in
            <button onClick={handleLogout}>logout</button>
          </p>
          <Togglable buttonLabel="new blog" ref={togglableRef}>
            <BlogForm />
          </Togglable>
          {blogList()}
        </div>
      )}
    </div>
  )
}

export default App
