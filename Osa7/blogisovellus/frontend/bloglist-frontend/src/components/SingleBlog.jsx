import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { likeBlog } from '../reducers/blogReducer'
import BlogService from '../services/blogs'

const SingleBlog = ({ getById }) => {
  const dispatch = useDispatch()
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    const fetchBlog = async () => {
      const blog = await getById(id)
      setBlog(blog)
    }
    fetchBlog()
  }, [getById, id])
  console.log('single blog:', blog)

  if (!blog) {
    return <div>Loading...</div>
  }

  const handleLike = () => {
    setBlog({ ...blog, likes: blog.likes + 1 })
    dispatch(likeBlog(blog))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const commentText = event.target.comment.value
    try {
      const updatedBlog = await BlogService.addNewCommentToBlog(
        blog.id,
        commentText
      )
      setBlog(updatedBlog)
      setNewComment('')
      event.target.comment.value = ''
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  return (
    <div>
      <h2>{blog.title}</h2>
      <a href={blog.url}>{blog.url}</a>
      <p>
        Likes: {blog.likes}
        <button onClick={handleLike}>like</button>
      </p>
      <p>Author: {blog.author}</p>
      <h3>Comments</h3>
      <form onSubmit={handleSubmit}>
        <input type="text" name="comment" />
        <button type="submit">add comment</button>
      </form>
      <ul>
        {blog.comments.map((comment, index) => (
          <li key={index}>{comment}</li>
        ))}
      </ul>
    </div>
  )
}

export default SingleBlog
