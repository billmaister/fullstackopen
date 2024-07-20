const { test, after, describe, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const assert = require('node:assert')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)

let TOKEN = ''

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('salasana', 10)
  const user = new User({
    username: 'test',
    name: 'Test User',
    passwordHash,
  })

  await user.save()
})

beforeEach(async () => {
  await Blog.deleteMany({})

  const users = await User.find({})
  const user = users[0]

  const initialBlogs = helper.initialBlogs.map(
    ({ title, author, url, likes }) => {
      return {
        title,
        author,
        url,
        likes,
        user: user.id,
      }
    }
  )

  await Blog.insertMany(initialBlogs)
})

beforeEach(async () => {
  const user = {
    username: 'test',
    password: 'salasana',
  }

  const loggedUser = await api.post('/api/login').send(user)
  TOKEN = loggedUser.body.token
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
  test('blog is added to db and amount of blogs increases by one when user is authorized', async () => {
    const newBlog = {
      title: 'First class tests, second edition',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 11,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${TOKEN}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const blogTitles = response.body.map((blog) => blog.title)

    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)

    assert(blogTitles.includes('First class tests, second edition'))
  })

  test('blog cannot be added by unauthorized user', async () => {
    const newBlog = {
      title: 'More class tests, third edition',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 11,
    }

    const result = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)

    assert(result.body.error.includes('missing or invalid token'))
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
      .set('Authorization', `Bearer ${TOKEN}`)
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

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${TOKEN}`)
      .expect(400)

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

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${TOKEN}`)
      .expect(400)

    const blogsAfter = await api.get('/api/blogs')
    const blogAmountAfter = blogsAfter.body.length

    assert.strictEqual(blogAmountInitially, blogAmountAfter)
  })
})

describe('deleting a blog', () => {
  test('using an blog id', async () => {
    const blogsInDBInitially = await helper.blogsInDb()
    const firstBlog = blogsInDBInitially[0]

    await api
      .delete(`/api/blogs/${firstBlog.id}`)
      .set('Authorization', `Bearer ${TOKEN}`)
      .expect(204)

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
      .set('Authorization', `Bearer ${TOKEN}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsInDBAfterUpdate = await helper.blogsInDb()
    const blogAfterUpdate = blogsInDBAfterUpdate.find(
      (blog) => blog.id === firstBlogInitially.id
    )

    assert.strictEqual(blogAfterUpdate.likes, 42)
  })
})

describe('when there is initially one user at db', () => {
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'test',
      name: 'Test User',
      password: 'salasana',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'ro',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(
      result.body.error.includes(
        'password and username must be at least 3 characters long'
      )
    )

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('password and username must be given'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'salama',
      name: 'Superuser',
      password: 'sa',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(
      result.body.error.includes(
        'password and username must be at least 3 characters long'
      )
    )

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'salama',
      name: 'Superuser',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('password and username must be given'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})
