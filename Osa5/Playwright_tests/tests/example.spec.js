const { test, describe, expect, beforeEach } = require('@playwright/test');

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Borje Blogipoika',
        username: 'Borje',
        password: 'borje123'
      }
    })

    await page.goto('http://localhost:5173')
  })
  test('front page can be opened', async ({ page }) => {
    const locator = page.getByText('blogs')
    await expect(locator).toBeVisible()
    await expect(page.getByPlaceholder('username')).toBeVisible()
    await expect(page.getByPlaceholder('password')).toBeVisible()
    const loginForm = page.getByRole('button', { name: 'login' })
    await expect(loginForm).toBeVisible()
  })
  test('user can login', async ({ page }) => {
    await page.getByPlaceholder('username').fill('Borje')
    await page.getByPlaceholder('password').fill('borje123')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByText(/Borje Blogipoika logged in/)).toBeVisible()
  })
  test('login fails with wrong password', async ({ page }) => {
    await page.getByPlaceholder('username').fill('Borje')
    await page.getByPlaceholder('password').fill('wrong')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByText('wrong username or password')).toBeVisible()
    const element = page.locator('html')
    await expect(element).not.toContainText('Borje Blogipoika logged in')
    await expect(page.getByText('wrong username or password')).toHaveCSS('color', 'rgb(255, 0, 0)')
    await expect(page.getByText('wrong username or password')).toHaveCSS('border-style', 'solid')
  })
})

describe('When logged in', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Borje Blogipoika',
        username: 'Borje',
        password: 'borje123'
      }
    })
    await page.goto('http://localhost:5173')
    await page.getByPlaceholder('username').fill('Borje')
    await page.getByPlaceholder('password').fill('borje123')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByText('Borje Blogipoika logged in')).toBeVisible()
  })
  test('a blog can be created', async ({ page }) => {
    await page.getByRole('button', { name: 'new blog' }).click()
    await page.getByPlaceholder('title').fill('Jankku Jussin tarina')
    await page.getByPlaceholder('author').fill('Jankku Jussi')
    await page.getByPlaceholder('url').fill('www.jankkujussi.com')
    await page.getByRole('button', { name: 'create' }).click()
    await expect(page.getByText('a new blog Jankku Jussin tarina by Jankku Jussi added')).toBeVisible()
    await expect(page.locator('.blog', { hasText: 'Jankku Jussin tarina' })).toBeVisible()

  })
})