import { useMutation } from '@apollo/client/react'
import { ALL_AUTHORS, UPDATE_AUTHOR } from '../queries'

const BirthYear = (props) => {
    const authors = props.authors
  const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [ALL_AUTHORS]
  })

  if (!props.show) {
    return null
  }
  if (!props.token) {
    return <div>
      <p>You must be logged in to edit an author</p>
    </div>
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const form = event.target
    const name = form.name.value
    const born = parseInt(form.born.value)
    updateAuthor({ variables: { name, setBornTo: born } })
  }

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={handleSubmit}>
        <div>
          name
          <select name="name">
            {authors.map((a) => (
              <option key={a.id} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          born
          <input type="number" name="born" />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default BirthYear