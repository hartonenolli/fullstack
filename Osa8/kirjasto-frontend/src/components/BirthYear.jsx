import { useMutation } from '@apollo/client/react'
import { ALL_AUTHORS, UPDATE_AUTHOR } from '../queries'

const BirthYear = (props) => {
  const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [ALL_AUTHORS]
  })

  if (!props.show) {
    return null
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
          <input name="name" />
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