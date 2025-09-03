import { useSelector } from "react-redux"

const Notification = () => {
  const message = useSelector((state) => state.notification)
  const colorMessage = message === 'ALKUVIESTI' ? 'green' : 'red'

  const style = {
    color: colorMessage,
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
  }
  if (message === null) {
    return null
  }
  return <div style={style}>{message}</div>
}

export default Notification
