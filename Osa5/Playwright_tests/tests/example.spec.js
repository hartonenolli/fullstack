const { test, describe, expect, beforeEach } = require('@playwright/test');

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })
  test('front page can be opened', async ({ page }) => {
    const locator = page.getByText('blogs')
    await expect(locator).toBeVisible()
    const loginForm = page.getByRole('button', { name: 'login' })
    await expect(loginForm).toBeVisible()
  })
})