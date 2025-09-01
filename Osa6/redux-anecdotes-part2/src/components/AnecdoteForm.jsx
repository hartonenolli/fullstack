import { useContext } from "react"
import NotificationContext from "../NotificationContext"

const AnecdoteForm = (props) => {
  const [notification, setNotification] = useContext(NotificationContext)

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    props.createAnecdote(content)
    console.log('new anecdote')
    setNotification(`Anecdote '${content}' created!`)
}

  return (
    <NotificationContext.Provider value={[notification, setNotification]}>
      <div>
        <h3>create new</h3>
        <form onSubmit={onCreate}>
          <input name='anecdote' />
          <button type="submit">create</button>
      </form>
    </div>
  </NotificationContext.Provider>
)

}

export default AnecdoteForm
