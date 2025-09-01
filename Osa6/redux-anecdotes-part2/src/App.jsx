import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, createAnecdote, updateAnecdote } from './requests'

const App = () => {
  const queryClient = useQueryClient()
  const newMutation = useMutation({
    mutationFn: createAnecdote,
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
  )
}

export default App
