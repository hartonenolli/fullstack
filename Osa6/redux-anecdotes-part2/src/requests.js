import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = () => {
  return axios.get(baseUrl).then(response => response.data)
}

export const createAnecdote = (content) => {
  return axios.post(baseUrl, { content, votes: 0 }).then(response => response.data)
}

export const updateAnecdote = (votedAnecdote) => {
  return axios.put(`${baseUrl}/${votedAnecdote.id}`, { content: votedAnecdote.content, votes: votedAnecdote.votes }).then(response => response.data)
}
