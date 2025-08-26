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
    }
    )
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
  test('a blog can be liked', async ({ page }) => {
    await page.getByRole('button', { name: 'new blog' }).click()
    await page.getByPlaceholder('title').fill('Jankku Jussin tarina')
    await page.getByPlaceholder('author').fill('Jankku Jussi')
    await page.getByPlaceholder('url').fill('www.jankkujussi.com')
    await page.getByRole('button', { name: 'create' }).click()
    await expect(page.getByText('a new blog Jankku Jussin tarina by Jankku Jussi added')).toBeVisible()
    const blog = page.locator('.blog', { hasText: 'Jankku Jussin tarina' })
    await blog.getByRole('button', { name: 'view' }).click()
    await blog.getByRole('button', { name: 'like' }).click()
    await expect(blog).toContainText('likes 1')
  })
  test('a blog can be deleted', async ({ page }) => {
    await page.getByRole('button', { name: 'new blog' }).click()
    await page.getByPlaceholder('title').fill('Jankku Jussin tarina')
    await page.getByPlaceholder('author').fill('Jankku Jussi')
    await page.getByPlaceholder('url').fill('www.jankkujussi.com')
    await page.getByRole('button', { name: 'create' }).click()
    await expect(page.getByText('a new blog Jankku Jussin tarina by Jankku Jussi added')).toBeVisible()
    await page.waitForTimeout(1000)
    const blog = page.locator('.blog', { hasText: 'Jankku Jussin tarina' })
    await blog.getByRole('button', { name: 'view' }).click()
    await blog.getByRole('button', { name: 'remove' }).click()
    page.once('dialog', dialog => dialog.accept())
    await blog.getByRole('button', { name: 'remove' }).click()
    await expect(page.locator('.blog', { hasText: 'Jankku Jussin tarina' })).toHaveCount(0)
  })
  test('only person who created the blog can see delete button', async ({ page, request }) => {
    await page.getByRole('button', { name: 'new blog' }).click()
    await page.getByPlaceholder('title').fill('Jankku Jussin tarina')
    await page.getByPlaceholder('author').fill('Jankku Jussi')
    await page.getByPlaceholder('url').fill('www.jankkujussi.com')
    await page.getByRole('button', { name: 'create' }).click()
    await expect(page.getByText('a new blog Jankku Jussin tarina by Jankku Jussi added')).toBeVisible()
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Meikäläinen',
        username: 'Matti',
        password: 'matti123'
      }
    })
    await page.getByRole('button', { name: 'logout' }).click()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
    await page.getByPlaceholder('username').fill('Matti')
    await page.getByPlaceholder('password').fill('matti123')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByText('Matti Meikäläinen logged in')).toBeVisible()
    const blog = page.locator('.blog', { hasText: 'Jankku Jussin tarina' })
    await blog.getByRole('button', { name: 'view' }).click()
    await expect(blog.getByRole('button', { name: 'remove' })).toHaveCount(0)
  })
  test('blogs are ordered according to likes', async ({ page }) => {
    await page.getByRole('button', { name: 'new blog' }).click()
    await page.getByPlaceholder('title').fill('Eniten tykkäyksiä')
    await page.getByPlaceholder('author').fill('Eniten')
    await page.getByPlaceholder('url').fill('www.enitentykkyyksia.com')
    await page.getByRole('button', { name: 'create' }).click()
    await expect(page.getByText('a new blog Eniten tykkäyksiä by Eniten added')).toBeVisible()
    await page.waitForTimeout(500)
    await page.getByRole('button', { name: 'new blog' }).click()
    await page.getByPlaceholder('title').fill('Keskiverto tykkäykset')
    await page.getByPlaceholder('author').fill('Keskiverto')
    await page.getByPlaceholder('url').fill('www.keskivertotykkyyksia.com')
    await page.getByRole('button', { name: 'create' }).click()
    await expect(page.getByText('a new blog Keskiverto tykkäykset by Keskiverto added')).toBeVisible()
    await page.waitForTimeout(500)
    await page.getByRole('button', { name: 'new blog' }).click()
    await page.getByPlaceholder('title').fill('Vähän tykkäyksiä')
    await page.getByPlaceholder('author').fill('Vähän')
    await page.getByPlaceholder('url').fill('www.vahantykkyyksia.com')
    await page.getByRole('button', { name: 'create' }).click()
    await expect(page.getByText('a new blog Vähän tykkäyksiä by Vähän added')).toBeVisible()
    await page.waitForTimeout(500)
    const blogs = page.locator('.blog')
    await blogs.nth(0).getByRole('button', { name: 'view' }).click()
    await blogs.nth(0).getByRole('button', { name: 'like' }).click()
    await page.waitForTimeout(500)
    await blogs.nth(0).getByRole('button', { name: 'like' }).click()
    await page.waitForTimeout(500)
    await blogs.nth(1).getByRole('button', { name: 'view' }).click()
    await blogs.nth(1).getByRole('button', { name: 'like' }).click()
    await page.waitForTimeout(500)
    await blogs.nth(0).getByRole('button', { name: 'hide' }).click()
    const titles = await blogs.allTextContents()
    expect(titles[0]).toContain('Eniten tykkäyksiä')
    expect(titles[1]).toContain('Keskiverto tykkäykset')
    expect(titles[2]).toContain('Vähän tykkäyksiä')
  })
})  