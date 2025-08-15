import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Toggable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [colorMessage, setColorMessage] = useState('')
  const togglableRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

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
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage('wrong username or password')
      setColorMessage('red')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const addBlog = async (blogObject) => {
    blogService.create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
        setColorMessage('green')
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        togglableRef.current.toggleVisibility()
      })
      .catch(error => {
        setMessage('error creating blog')
        setColorMessage('red')
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )


  const blogForm = () => (
    <div>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
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
      <Notification message={message} colorMessage={colorMessage} />
      {!user && loginForm()}
      {user && <div>
        <p>{user.name} logged in
          <button onClick={handleLogout}>logout</button>
        </p>
        <Togglable buttonLabel="new blog" ref={togglableRef}>
          <BlogForm
            createBlog={addBlog}
          />
        </Togglable>
        {blogForm()}
      </div>}
    </div>
  )
}

export default App