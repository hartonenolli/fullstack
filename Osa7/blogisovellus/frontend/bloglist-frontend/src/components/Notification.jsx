import { useSelector } from 'react-redux'
import { Alert, Box } from '@mui/material'

const Notification = () => {
  const notification = useSelector((state) => state.notification)

  if (notification.message === null) {
    return null
  }
  const style = {
    color: notification.color,
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Alert severity={notification.color} style={style}>
        {notification.message}
      </Alert>
    </Box>
  )
}

export default Notification
