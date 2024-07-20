const { test, after, describe, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const assert = require('node:assert')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('When blog list has initial blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('each blogs identifier key is named  as id and not _id', async () => {
    const response = await api.get('/api/blogs')
    const allKeys = Object.keys(response.body[0])
    assert(allKeys.includes('id'))
    assert(!allKeys.includes('_id'))
  })
})

describe('When adding a new blog', () => {
  test('blog is added to db and amount of blogs increases by one', async () => {
    const newBlog = {
      title: 'First class tests, second edition',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 11,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const blogTitles = response.body.map((blog) => blog.title)

    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)

    assert(blogTitles.includes('First class tests, second edition'))
  })

  test('without specifying likes will output as likes set as 0', async () => {
    const newBlog = {
      title: 'Test wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
  })

  test('blog without title will not be added', async () => {
    const newBlog = {
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    }

    const blogBefore = await api.get('/api/blogs')
    const blogAmountInitially = blogBefore.body.length

    await api.post('/api/blogs').send(newBlog).expect(400)

    const blogsAfter = await api.get('/api/blogs')
    const blogAmountAfter = blogsAfter.body.length

    assert.strictEqual(blogAmountInitially, blogAmountAfter)
  })

  test('blog without url will not be added', async () => {
    const newBlog = {
      title: 'Testing NodeJS',
      author: 'Robert C. Martin',
    }

    const blogBefore = await api.get('/api/blogs')
    const blogAmountInitially = blogBefore.body.length

    await api.post('/api/blogs').send(newBlog).expect(400)

    const blogsAfter = await api.get('/api/blogs')
    const blogAmountAfter = blogsAfter.body.length

    assert.strictEqual(blogAmountInitially, blogAmountAfter)
  })
})

describe('deleting a blog', () => {
  test('using an blog id', async () => {
    const blogsInDBInitially = await helper.blogsInDb()
    const firstBlog = blogsInDBInitially[0]

    await api.delete(`/api/blogs/${firstBlog.id}`).expect(204)

    const blogsInDBAfter = await helper.blogsInDb()

    assert.strictEqual(blogsInDBInitially.length - 1, blogsInDBAfter.length)

    const blogTitles = blogsInDBAfter.map((blog) => blog.title)

    assert(!blogTitles.includes(firstBlog.title))
  })
})

describe('updating a blog', () => {
  test('updating likes of the first blog', async () => {
    const blogsInDBInitially = await helper.blogsInDb()
    const firstBlogInitially = blogsInDBInitially[0]

    const newBlog = {
      title: firstBlogInitially.title,
      author: firstBlogInitially.author,
      url: firstBlogInitially.url,
      likes: 42,
    }

    await api
      .put(`/api/blogs/${firstBlogInitially.id}`)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsInDBAfterUpdate = await helper.blogsInDb()
    const blogAfterUpdate = blogsInDBAfterUpdate.find(
      (blog) => blog.id === firstBlogInitially.id
    )

    assert.strictEqual(blogAfterUpdate.likes, 42)
  })
})

after(async () => {
  await mongoose.connection.close()
})
