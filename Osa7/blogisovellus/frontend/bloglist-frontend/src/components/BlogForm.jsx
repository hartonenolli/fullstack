import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'
import {
  setNotification,
  clearNotification,
} from '../reducers/notificationReducer'

const BlogForm = () => {
  const dispatch = useDispatch()
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleNewBlog = (event) => {
    event.preventDefault()
    dispatch(
      createBlog({
        title: newTitle,
        author: newAuthor,
        url: newUrl,
      })
    )
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
    dispatch(
      setNotification({
        message: `a new blog ${newTitle} by ${newAuthor} added`,
        color: 'green',
      })
    )
    setTimeout(() => {
      dispatch(clearNotification())
    }, 5000)
  }

  return (
    <form onSubmit={handleNewBlog}>
      <div>
        <h2>Create New Blog</h2>
      </div>
      <div>
        title
        <input
          type="text"
          value={newTitle}
          name="Title"
          aria-label="title"
          placeholder="title"
          onChange={({ target }) => setNewTitle(target.value)}
        />
      </div>
      <div>
        author
        <input
          type="text"
          value={newAuthor}
          name="Author"
          aria-label="author"
          placeholder="author"
          onChange={({ target }) => setNewAuthor(target.value)}
        />
      </div>
      <div>
        url
        <input
          type="text"
          value={newUrl}
          name="Url"
          aria-label="url"
          placeholder="url"
          onChange={({ target }) => setNewUrl(target.value)}
        />
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default BlogForm
