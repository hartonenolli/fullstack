import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { likeBlog } from '../reducers/blogReducer'

const SingleBlog = ({ getById }) => {
  const dispatch = useDispatch()
  const { id } = useParams()
  const [blog, setBlog] = useState(null)

  useEffect(() => {
    const fetchBlog = async () => {
      const blog = await getById(id)
      setBlog(blog)
    }
    fetchBlog()
  }, [getById, id])

  if (!blog) {
    return <div>Loading...</div>
  }

  const handleLike = () => {
    setBlog({ ...blog, likes: blog.likes + 1 })
    dispatch(likeBlog(blog))
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
    </div>
  )
}

export default SingleBlog
