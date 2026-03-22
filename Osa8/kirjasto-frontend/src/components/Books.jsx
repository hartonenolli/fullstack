import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'

const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      author
      published
    }
  }
`
const Books = (props) => {
  const { loading, error, data } = useQuery(ALL_BOOKS)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  const books = data.allBooks

  if (!props.show) {
    return null
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
