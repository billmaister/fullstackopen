import { useState } from 'react'
import blogService from './../services/blogs'
import PropTypes from 'prop-types'

const Blog = ({ blog, user, setBlogs, showNotification }) => {
  const [showAll, setShowAll] = useState(false)

  Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    setBlogs: PropTypes.func.isRequired,
    showNotification: PropTypes.func.isRequired,
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const handleBlogLike = async (event) => {
    event.preventDefault()
    try {
      const updatedBlog = await blogService.updateBlog(
        {
          user: user.id,
          likes: blog.likes + 1,
          author: blog.author,
          title: blog.title,
          url: blog.url,
        },
        blog.id
      )
      setBlogs((prev) =>
        prev
          .map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog))
          .sort((a, b) => b.likes - a.likes)
      )
      showNotification(
        `You liked blog ${blog.title} by ${blog.author}`,
        'success'
      )
    } catch (error) {
      showNotification(`Liking failed: ${error.response.data.error}`, 'error')
    }
  }

  const handleRemove = async () => {
    if (
      window.confirm(
        `Are you sure you want to remove blog ${blog.title} by ${blog.author}`
      )
    ) {
      try {
        await blogService.removeBlog(blog.id)
        setBlogs((prev) => prev.filter((b) => b.id !== blog.id))
        showNotification(
          `Blog ${blog.title} by ${blog.author} removed successfully`,
          'success'
        )
      } catch (error) {
        showNotification(
          `Removing failed: ${error.response.data.error}`,
          'error'
        )
      }
    }
    return
  }

  return (
    <div style={blogStyle} className='blog'>
      <div>
        {blog.title} by {blog.author}{' '}
        <button onClick={() => setShowAll((prev) => !prev)}>
          {showAll ? 'hide' : 'view'}
        </button>
      </div>
      {showAll && (
        <div>
          <p>{blog.url}</p>
          <div>
            likes {blog.likes} <button onClick={handleBlogLike}>like</button>
          </div>
          <p>{blog.user.name}</p>
          {blog.user.id === user.id && (
            <button onClick={handleRemove}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
