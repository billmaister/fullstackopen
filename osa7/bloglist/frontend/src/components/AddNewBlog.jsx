import { useState } from "react";
import blogService from "./../services/blogs";
import { useDispatch } from "react-redux";
import { setNotification } from "../reducers/notificationReducer";
import { createBlog } from "../reducers/blogReducer";

const AddNewBlog = ({ setShowAddBlog }) => {
  const [blog, setBlog] = useState({
    title: "",
    author: "",
    url: "",
  });

  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(createBlog(blog));
    setBlog({
      title: "",
      author: "",
      url: "",
    });
    setShowAddBlog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBlog({ ...blog, [name]: value });
  };

  return (
    <div>
      <h2>Create new blog</h2>
      <form onSubmit={handleSubmit}>
        <div>
          Title
          <input
            type="text"
            value={blog.title}
            name="title"
            onChange={handleInputChange}
            placeholder="Blog title"
            id="add-title"
          />
        </div>
        <div>
          Author
          <input
            type="text"
            value={blog.author}
            name="author"
            onChange={handleInputChange}
            placeholder="Blog author"
            id="add-author"
          />
        </div>
        <div>
          URL
          <input
            type="text"
            value={blog.url}
            name="url"
            onChange={handleInputChange}
            placeholder="Blog url"
            id="add-url"
          />
        </div>
        <button onClick={() => setShowAddBlog(false)}>Cancel</button>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddNewBlog;
