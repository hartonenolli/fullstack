import { useState, useEffect } from 'react'
import { useSubscription, useApolloClient, useQuery } from '@apollo/client/react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Recommend from './components/Recomend'
import LoginForm from './components/LoginForm'
import { BOOK_ADDED, ALL_BOOKS, GENRES } from './queries'

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('library-user-token'))
  const [page, setPage] = useState('authors')
  const [loginPageText, setLoginPageText] = useState('login')

  useEffect(() => {
    setLoginPageText(token ? 'logout' : 'login')
  }, [token])

  const client = useApolloClient()

  useQuery(GENRES)
  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      alert(`New book added: ${addedBook.title} by ${addedBook.author.name}`)

      client.cache.updateQuery({ query: ALL_BOOKS }, (dataInStore) => {
        if (!dataInStore) return dataInStore
        if (dataInStore.allBooks.find(b => b.id === addedBook.id)) return dataInStore
        return { allBooks: dataInStore.allBooks.concat(addedBook) }
      })

      client.cache.updateQuery({ query: GENRES }, (dataInStore) => {
        if (!dataInStore) return dataInStore
        const updatedGenres = Array.from(
          new Set([...dataInStore.genres, ...addedBook.genres])
        )
        return { genres: updatedGenres }
      })
    }
  })

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('recommend')}>recommend</button>
        <button onClick={() => setPage('login')}>{loginPageText}</button>
      </div>

      <Authors show={page === 'authors'} token={token} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} token={token} />

      <Recommend show={page === 'recommend'} token={token} />

      <LoginForm show={page === 'login'} setToken={setToken} />
    </div>
  )
}

export default App
