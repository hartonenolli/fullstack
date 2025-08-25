import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import { test } from 'vitest'
import userEvent from '@testing-library/user-event'

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

  test('shows url and likes when view button is clicked', async () => {
    render(<Blog blog={blog} />)
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)
    const urlElement = screen.getByText(/https:\/\/testblog.com/)
    const likesElement = screen.getByText(/likes 0/)
    const usernameElement = screen.getByText('Test User')
    expect(usernameElement).toBeInTheDocument() // User name should be visible after clicking view
    expect(urlElement).toBeInTheDocument() // URL should be visible after clicking view
    expect(likesElement).toBeInTheDocument() // Likes should be visible after clicking view
  })

  test('calls event handler twice when like button is clicked twice', async () => {
    const mockHandler = vi.fn()
    render(<Blog blog={blog} handleLike={mockHandler} />)
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler).toHaveBeenCalledTimes(2)
  })
})
