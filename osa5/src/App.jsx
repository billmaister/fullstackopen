import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Login from './components/Login'
import AddNewBlog from './components/AddNewBlog'
import Notification from './components/Notification'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [showAddBlog, setShowAddBlog] = useState(false)

  useEffect(() => {
    blogService
      .getAll()
      .then((blogs) => setBlogs(blogs.sort((a, b) => b.likes - a.likes)))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
    setShowAddBlog(false)
  }, [])

  useEffect(() => {
    setShowAddBlog(false)
  }, [user])

  const showNotification = (msg, type) => {
    setNotification({ msg, type })
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogUser')
    setUser(null)
    showNotification('Logged of successfully', 'success')
  }

  if (!user) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification notification={notification} />
        <div>
          <Login setUser={setUser} showNotification={showNotification} />
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification notification={notification} />
      <div>
        Logged in as {user.name} <button onClick={handleLogout}>Log out</button>
      </div>
      {!showAddBlog && (
        <button id='add-blog-button' onClick={() => setShowAddBlog(true)}>
          Add new blog
        </button>
      )}
      {showAddBlog && (
        <AddNewBlog
          setBlogs={setBlogs}
          showNotification={showNotification}
          setShowAddBlog={setShowAddBlog}
        />
      )}
      <div>
        <h2>List of blogs</h2>
        <div id='blog-container'>
          {blogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              user={user}
              setBlogs={setBlogs}
              showNotification={showNotification}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
