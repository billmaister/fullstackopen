import { createSlice } from '@reduxjs/toolkit';
import blogServices from './../services/blogs';

export const appUsersSlice = createSlice({
  name: 'appUsers',
  initialState: [],
  reducers: {
    setAppUsers: (state, action) => {
      return action.payload;
    },
    updateAppUsers: (state, action) => {
      const { user, blog } = action.payload;
      const usersCurrBlogs = state.find((u) => u.id === user.id).blogs;
      const updatedUser = { ...user, blogs: [...usersCurrBlogs, blog] };
      return state.map((u) => (u.id === user.id ? updatedUser : u));
    },
  },
});

export const { setAppUsers, updateAppUsers } = appUsersSlice.actions;
export default appUsersSlice.reducer;

export const initializeAppUsers = () => {
  return async (dispatch) => {
    try {
      const appUsers = await blogServices.getAllAppUsers();
      dispatch(setAppUsers(appUsers));
    } catch (error) {
      console.log(error);
    }
  };
};
