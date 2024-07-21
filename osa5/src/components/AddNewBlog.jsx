import { useState } from 'react'
import blogService from './../services/blogs'

const AddNewBlog = ({ setBlogs, showNotification, setShowAddBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const newBlog = await blogService.createBlog({
        title,
        author,
        url,
      })
      setBlogs((prev) => [...prev, newBlog].sort((a, b) => b.likes - a.likes))
      showNotification(
        `A new blog ${title} by ${author} added successfully`,
        'success'
      )
    } catch (error) {
      showNotification(error.response.data.error, 'error')
    }
    setTitle('')
    setAuthor('')
    setUrl('')
    setShowAddBlog(false)
  }

  return (
    <div>
      <h2>Create new blog</h2>
      <form onSubmit={handleSubmit}>
        <div>
          Title
          <input
            type='text'
            value={title}
            name='title'
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          Author
          <input
            type='text'
            value={author}
            name='author'
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          URL
          <input
            type='text'
            value={url}
            name='url'
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button onClick={() => setShowAddBlog(false)}>Cancel</button>
        <button type='submit'>Submit</button>
      </form>
    </div>
  )
}

export default AddNewBlog
