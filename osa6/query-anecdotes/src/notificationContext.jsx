import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SHOW_NOTIFICATION':
      return action.payload
    case 'CLEAR_NOTIFICATION':
      return ''
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    ''
  )

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  console.log(notificationAndDispatch)
  return notificationAndDispatch[0]
}

export const useNotificationDispatch = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  return notificationAndDispatch[1]
}

// export const showNotification = (content, timeout) => {
//   const { notificationDispatch } = useContext(NotificationContext)
//   notificationDispatch({
//     type: 'SHOW_NOTIFICATION',
//     payload: content,
//   })
//   setTimeout(() => {
//     notificationDispatch({
//       type: 'CLEAR_NOTIFICATION',
//     })
//   }, timeout)
// }

export default NotificationContext
