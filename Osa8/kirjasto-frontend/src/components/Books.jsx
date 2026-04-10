import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS, GENRES } from '../queries'

const Books = (props) => {
  const { loading, error, data } = useQuery(ALL_BOOKS)
  const genresData = useQuery(GENRES)
  const [genre, setGenre] = useState(null)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>
  if (genresData.loading) return <p>Loading genres...</p>
  if (genresData.error) return <p>Error loading genres: {genresData.error.message}</p>


  
  const books = data.allBooks ?? []
  const genres = genresData.data?.genres ?? []

  if (!props.show) {
    return null
  }

  const filteredBooks = genre
    ? books.filter(book => book.genres.includes(genre))
    : books
  
  return (
    <div>
      <h2>books</h2>

      <div>
        {genres.map(g => (
          <button key={g} onClick={() => setGenre(g)}>{g}</button>
        ))}
        <button onClick={() => setGenre(null)}>all genres</button>
      </div>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
