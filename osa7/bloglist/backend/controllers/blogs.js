const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
    id: 1,
  })
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body

  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'missing or invalid token' })
  }

  if (!title || !url) {
    response.status(400).json({ error: 'title or url missing' })
  }

  const newBlog = new Blog({
    author,
    title,
    url,
    likes: likes || 0,
    user: user.id,
  })

  const savedBlog = await newBlog.save()

  const blogToResponse = {
    ...savedBlog._doc,
    id: savedBlog._doc._id,
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
    },
  }

  user.blogs = user.blogs.concat(savedBlog.id)
  await user.save()

  response.status(201).json(blogToResponse)
})

blogRouter.delete('/:id', async (request, response) => {
  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'missing or invalid token' })
  }

  const blog = await Blog.findById(request.params.id)

  if (blog.user.toString() === user.id.toString()) {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } else {
    return response
      .status(401)
      .json({ error: 'user unauthorized to delete this blog' })
  }
})

blogRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  const blog = {
    title,
    author,
    url,
    likes: likes || 0,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
    runValidators: true,
    context: 'query',
  }).populate('user', {
    username: 1,
    name: 1,
    id: 1,
  })
  response.json(updatedBlog)
})

module.exports = blogRouter
