import { createSlice } from '@reduxjs/toolkit';
import blogServices from '../services/blogs';
import { setNotification } from './notificationReducer';
import { userLogout } from './userReducer';
import { updateAppUsers } from './appUsersReducer';

export const blogSlice = createSlice({
  name: 'blog',
  initialState: [],
  reducers: {
    updateBlog(state, action) {
      const updatedBlog = action.payload;
      return state.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog));
    },
    setBlogs(state, action) {
      return action.payload;
    },
    appendBlog(state, action) {
      state.push(action.payload);
    },
    deleteBlog(state, action) {
      const id = action.payload;
      return state.filter((blog) => blog.id !== id);
    },
  },
});

export const { updateBlog, setBlogs, appendBlog, deleteBlog } = blogSlice.actions;
export default blogSlice.reducer;

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogServices.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const createBlog = (newBlog) => {
  return async (dispatch) => {
    try {
      const blog = await blogServices.createBlog(newBlog);
      const { user, title, author, url, id } = blog;
      dispatch(
        updateAppUsers({
          user,
          blog: { title, author, url, id },
        }),
      );
      dispatch(appendBlog(blog));
      dispatch(
        setNotification(`A new blog ${blog.title} by ${blog.author} added successfully`, 'success'),
      );
    } catch (error) {
      dispatch(setNotification(`Creating blog failed: ${error.response?.data.error}`, 'error'));
      if (error.request?.status === 401) {
        dispatch(userLogout());
      }
    }
  };
};

export const likeBlog = (blog) => {
  return async (dispatch) => {
    try {
      const updatedBlog = await blogServices.updateBlog({
        ...blog,
        likes: blog.likes + 1,
      });
      dispatch(updateBlog(updatedBlog));
      dispatch(
        setNotification(`You liked blog ${updatedBlog.title} by ${updatedBlog.author}`, 'success'),
      );
    } catch (error) {
      dispatch(setNotification(`Liking failed: ${error.response?.data.error}`, 'error'));
      if (error.request?.status === 401) {
        dispatch(userLogout());
      }
    }
  };
};

export const commentBlog = (blog, comment) => {
  return async (dispatch) => {
    try {
      const updatedBlog = await blogServices.updateBlog({
        ...blog,
        comments: [...blog.comments, comment],
      });
      dispatch(updateBlog(updatedBlog));
      dispatch(setNotification(`You added new comment successfully`, 'success'));
    } catch (error) {
      dispatch(setNotification(`Commenting failed: ${error.response?.data.error}`, 'error'));
      if (error.request?.status === 401) {
        dispatch(userLogout());
      }
    }
  };
};

export const removeBlog = ({ id, title, author }) => {
  return async (dispatch) => {
    try {
      await blogServices.removeBlog(id);
      dispatch(deleteBlog(id));
      dispatch(setNotification(`Blog ${title} by ${author} removed successfully`, 'success'));
    } catch (error) {
      dispatch(setNotification(`Removing failed: ${error.response.data.error}`, 'error'));
      if (error.request.status === 401) {
        dispatch(userLogout());
      }
    }
  };
};
