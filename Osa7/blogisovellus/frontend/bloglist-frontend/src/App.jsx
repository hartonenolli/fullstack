import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Notification from './components/Notification'
import { loginUser, logoutUser } from './reducers/loginReducer'
import { initializeBlogs } from './reducers/blogReducer'
import {
  setNotification,
  clearNotification,
} from './reducers/notificationReducer'
import Togglable from './components/Toggable'
import BlogForm from './components/BlogForm'
import SingleUser from './components/SingleUser'
import Users from './components/Users'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import { Container } from '@mui/material'

const App = () => {
  const dispatch = useDispatch()
  const blogs = useSelector((state) => state.blogs)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const user = useSelector((state) => state.login)
  const padding = { padding: 5 }
  const togglableRef = useRef()
  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      dispatch(setUser(user))
    }
  }, [dispatch])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      dispatch(loginUser({ username, password }))
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
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  )

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  if (!user) {
    return (
      <div>
        <Notification />
        {loginForm()}
      </div>
    )
  }

  return (
    <Container>
    <Router>
      <div>
        <Link style={padding} to="/users">users</Link>
        <Link style={padding} to="/">blogs</Link>
        <Notification />
        <h2>blogs</h2>
        <p>
          {user.name} logged in
          <button onClick={handleLogout}>logout</button>
        </p>
        <Routes>
          <Route path="/users" element={<Users getAllUsers={blogService.getAllUsers} />} />
          <Route path="/users/:id" element={<SingleUser getAll={blogService.getAll} />} />
          <Route
            path="/"
            element={
              <div>
                <Togglable buttonLabel="new blog" ref={togglableRef}>
                  <BlogForm />
                </Togglable>
                {blogList()}
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
    </Container>
  )
}

export default App
