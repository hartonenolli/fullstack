import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, createAnecdote, updateAnecdote } from './requests'
import { useState } from 'react'
import NotificationContext from './NotificationContext'

const App = () => {
  const [notification, setNotification] = useState(null)
  const queryClient = useQueryClient()
  const newMutation = useMutation({
    mutationFn: createAnecdote,
    onError: (error) => {
      setNotification(`Too short anecdote, must be at least 5 characters`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['anecdotes'])
    }
  })
  const result = useQuery(
  {
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1
  }
)
const updateAnecdoteMutation = useMutation({
  mutationFn: updateAnecdote,
  onSuccess: () => {
    queryClient.invalidateQueries(['anecdotes'])
  }
})

const handleVote = (anecdote) => {
  updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
  setNotification(`Anecdote '${anecdote.content}' voted!`)
}

console.log(JSON.parse(JSON.stringify(result)));
if (result.isLoading) {
  return <div>Loading...</div>
}

if (result.error) {
  return <div>Anecdote service not available due to problems in server</div>
}

const anecdotes = result.data

  return (
    <NotificationContext.Provider value={[notification, setNotification]}>
      <div>
        <h3>Anecdote app</h3>

        <Notification />
        <AnecdoteForm createAnecdote={newMutation.mutate} />
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  </NotificationContext.Provider>
)
}

export default App
