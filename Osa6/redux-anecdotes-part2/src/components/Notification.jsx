import { useContext } from "react";
import NotificationContext from "../NotificationContext";

const Notification = () => {
  const [notification] = useContext(NotificationContext);
  const [_, setNotification] = useContext(NotificationContext);
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }

  if (!notification) return null
  else {
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  return (
    <NotificationContext.Provider value={[notification]}>
      <div style={style}>
        {notification}
      </div>
    </NotificationContext.Provider>
  )
}

export default Notification
