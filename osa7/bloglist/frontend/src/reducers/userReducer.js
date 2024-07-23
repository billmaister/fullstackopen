import { createSlice } from '@reduxjs/toolkit';
import blogServices from '../services/blogs';
import loginServices from '../services/login';
import { setNotification } from './notificationReducer';

const initialState = {
  name: '',
  token: '',
  username: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      return action.payload;
    },
    userLogout: (state, action) => {
      return null;
    },
  },
});

export const { setUser, userLogout } = userSlice.actions;

export default userSlice.reducer;

export const initializeUser = () => {
  return async (dispatch) => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user));
      blogServices.setToken(user.token);
    }
  };
};

export const login = (username, password) => {
  return async (dispatch) => {
    try {
      const user = await loginServices.login({
        username,
        password,
      });
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user));
      blogServices.setToken(user.token);
      dispatch(setUser(user));
      dispatch(setNotification('Logged in successfully', 'success'));
    } catch (exception) {
      dispatch(setNotification('Invalid username or password', 'error'));
    }
  };
};

export const logout = () => {
  return async (dispatch) => {
    window.localStorage.removeItem('loggedBlogUser');
    dispatch(userLogout());
    dispatch(setNotification('Logged of successfully', 'error'));
  };
};
