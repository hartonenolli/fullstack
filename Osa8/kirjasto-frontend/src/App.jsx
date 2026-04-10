import { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Recommend from './components/Recomend'
import LoginForm from './components/LoginForm'

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('library-user-token'))
  const [page, setPage] = useState('authors')
  const [loginPageText, setLoginPageText] = useState('login')

  useEffect(() => {
    setLoginPageText(token ? 'logout' : 'login')
  }, [token])

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
