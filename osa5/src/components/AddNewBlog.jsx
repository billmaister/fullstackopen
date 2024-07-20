import { useState } from 'react'
import blogService from './../services/blogs'

const AddNewBlog = ({ setBlogs, showNotification }) => {
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
      setBlogs((prev) => [...prev, newBlog])
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
        <button type='submit'>Submit</button>
      </form>
    </div>
  )
}

export default AddNewBlog
