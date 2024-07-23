import { useState } from "react";
import blogService from "./../services/blogs";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "../reducers/notificationReducer";
import { likeBlog, removeBlog } from "../reducers/blogReducer";

const Blog = ({ blog }) => {
  const [showAll, setShowAll] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector(({ user }) => user);

  Blog.propTypes = {
    blog: PropTypes.object.isRequired,
  };

  const handleBlogLike = async (event) => {
    event.preventDefault();
    dispatch(likeBlog(blog));
  };

  const handleRemove = async () => {
    if (
      window.confirm(
        `Are you sure you want to remove blog ${blog.title} by ${blog.author}`,
      )
    ) {
      dispatch(removeBlog(blog));
    }
    return;
  };

  return (
    <div className="blog blogStyle">
      <div>
        {blog.title} by {blog.author}{" "}
        <button onClick={() => setShowAll((prev) => !prev)}>
          {showAll ? "hide" : "view"}
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
  );
};

export default Blog;
