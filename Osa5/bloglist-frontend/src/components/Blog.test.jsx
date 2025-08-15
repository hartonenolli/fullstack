import { render, screen } from '@testing-library/react'
import Blog from './Blog'

describe('Blog', () => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'https://testblog.com',
    likes: 0,
    user: {
      name: 'Test User',
      username: 'testuser'
    }
  }

  test('renders blog title and author', () => {
    render(<Blog blog={blog} />)
    const titleElement = screen.getByText(/Test Blog/)
    const urlElement = screen.queryByText(/https:\/\/testblog.com/)
    const likesElement = screen.queryByText(/likes 0/)
    expect(titleElement).toBeInTheDocument()
    expect(urlElement).not.toBeInTheDocument() // URL should not be visible initially
    expect(likesElement).not.toBeInTheDocument() // Likes should not be visible

    screen.debug() // This will log the current state of the DOM
  })
})
