const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const allLikes = blogs.map((blog) => blog.likes)

  const reducer = (sum, item) => sum + item

  return allLikes.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return {}
  }
  const allLikes = blogs.map((blog) => blog.likes)
  const { title, author, likes } = blogs.find(
    ({ likes }) => likes === Math.max(...allLikes)
  )
  return { title, author, likes }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return {}
  }

  const blogCount = blogs.reduce((blogCounter, blog) => {
    blogCounter[blog.author] = (blogCounter[blog.author] || 0) + 1
    return blogCounter
  }, {})

  const mostBlogsAuthor = Object.keys(blogCount).reduce((highest, curr) =>
    blogCount[curr] > blogCount[highest] ? curr : highest
  )

  return { author: mostBlogsAuthor, blogs: blogCount[mostBlogsAuthor] }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return {}
  }

  const likesCount = blogs.reduce((likesCounter, blog) => {
    likesCounter[blog.author] = (likesCounter[blog.author] || 0) + blog.likes
    return likesCounter
  }, {})

  const mostLikesAuthor = Object.keys(likesCount).reduce((highest, curr) =>
    likesCount[curr] > likesCount[highest] ? curr : highest
  )

  return { author: mostLikesAuthor, likes: likesCount[mostLikesAuthor] }
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
