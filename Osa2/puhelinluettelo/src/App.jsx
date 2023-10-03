import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({ showBy, handlePersonsToShow }) => {
  return (
    <div>
      filter shown with <input value={showBy} onChange={handlePersonsToShow} />
    </div>
  )
  }

const PersonForm = ({ addPerson, newName, handlePersonChange, newNumber, handleNumberChange }) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handlePersonChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({ personsToShow }) => {
  return (
    <div>
      {personsToShow.map(person => <p key={person.name}>{person.name} {person.number}</p>)}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showBy, setShowBy] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
      setPersons(response.data)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
    if (persons.find(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }
    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
  }

  const handlePersonChange = (event) => {
    //console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    //console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handlePersonsToShow = (event) => {
    //console.log(event.target.value)
    setShowBy(event.target.value)
  }

  const personsToShow = showBy
    ? persons.filter(person => person.name.toLowerCase().includes(showBy.toLowerCase()))
    : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter showBy={showBy} handlePersonsToShow={handlePersonsToShow} />
      <h3>Add a new</h3>
      <PersonForm addPerson={addPerson} newName={newName} handlePersonChange={handlePersonChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} />
    </div>
  )

}

export default App