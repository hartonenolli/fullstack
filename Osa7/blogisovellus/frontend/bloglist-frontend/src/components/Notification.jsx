const Notification = ({ message, colorMessage }) => {
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
