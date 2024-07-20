const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body

  if (!title || !url) {
    response.status(400).json({ error: 'Title or url missing' })
  }

  const newBlog = new Blog({
    author,
    title,
    url,
    likes: likes || 0,
  })

  const savedBlog = await newBlog.save()
  response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
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
  })
  response.json(updatedBlog)
})

module.exports = blogRouter
