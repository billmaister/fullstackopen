import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    showNotification(state, action) {
      return action.payload
    },
    hideNotification(state, action) {
      return ''
    },
  },
})

export const { showNotification, hideNotification } = notificationSlice.actions
export default notificationSlice.reducer

export const setNotification = (msg, time) => {
  return (dispatch) => {
    dispatch(showNotification(msg))
    setTimeout(() => {
      dispatch(hideNotification())
    }, time * 1000)
  }
}
