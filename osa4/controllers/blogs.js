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

module.exports = blogRouter
