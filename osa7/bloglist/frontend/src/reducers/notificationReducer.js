import { createSlice } from "@reduxjs/toolkit";

const initNotification = {
  msg: "",
  type: "none",
};

const notificationSlice = createSlice({
  name: "notification",
  initialState: initNotification,
  reducers: {
    showNotification(state, action) {
      return action.payload;
    },
    hideNotification(state, action) {
      return initNotification;
    },
  },
});

export const { showNotification, hideNotification } = notificationSlice.actions;
export default notificationSlice.reducer;

export const setNotification = (msg, type, time) => {
  return (dispatch) => {
    dispatch(showNotification({ msg, type }));
    setTimeout(
      () => {
        dispatch(hideNotification());
      },
      time ? time * 1000 : 2000,
    );
  };
};
