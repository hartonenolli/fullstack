import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  message: null,
  color: 'green',
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      return { message: action.payload.message, color: action.payload.color }
    },
    clearNotification() {
      return { message: null, color: 'green' }
    },
  },
})

export const { setNotification, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer
