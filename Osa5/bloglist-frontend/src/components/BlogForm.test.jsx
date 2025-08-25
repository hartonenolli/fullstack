import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'
import { beforeEach, describe, expect, test } from 'vitest'
import { vi } from 'vitest'

describe('BlogForm', () => {
  let mockHandler

  beforeEach(() => {
    mockHandler = vi.fn()
    render(<BlogForm createBlog={mockHandler} />)
  })
  test('render screen', () => {
    screen.debug()
  })

  test('create button can be clicked', async () => {
    const user = userEvent.setup()
    const button = await screen.findByText('create')
    await user.click(button)
    expect(mockHandler).toHaveBeenCalledTimes(1)
  })

  test('form calls the event handler with the right details when a new blog is created', async () => {
    const user = userEvent.setup()

    const titleInput = screen.getByLabelText('title')
    const authorInput = screen.getByLabelText('author')
    const urlInput = screen.getByLabelText('url')
    const createButton = screen.getByText('create')

    await user.type(titleInput, 'New Blog')
    await user.type(authorInput, 'New Author')
    await user.type(urlInput, 'https://newblog.com')
    await user.click(createButton)

    expect(mockHandler).toHaveBeenCalledTimes(1)
    expect(mockHandler).toHaveBeenCalledWith({
      title: 'New Blog',
      author: 'New Author',
      url: 'https://newblog.com'
    })
  })
})