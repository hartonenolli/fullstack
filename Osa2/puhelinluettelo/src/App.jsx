import { useState, useEffect } from 'react'
import personService from './services/persons'
import './index.css'

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

const Persons = ({ personsToShow, deletePerson }) => {
  return (
    <div>
      {personsToShow.map(person => <p key={person.name}>{person.name} {person.number}
        <button onClick={() => deletePerson(person.id)}>delete</button>
        </p>)}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showBy, setShowBy] = useState('')
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
    if (persons.find(person => person.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`) !== false) {
        const id = persons.find(person => person.name === newName).id
        personService
          .updatePerson(id, personObject)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
            setMessage(`Updated ${returnedPerson.name}`)
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
          .catch(error => {
            setErrorMessage(`Information of ${personObject.name} has already been removed from server`)
            setPersons(persons.filter(person => person.id !== id))
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
      }
      return
    }
    personService
      .addNew(personObject)
      .then(returnedPersons => {
        setPersons(persons.concat(returnedPersons))
      })
    setNewName('')
    setNewNumber('')
    setMessage(`Added ${personObject.name}`)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const deletePerson = (id) => {
    if (window.confirm(`Delete ${persons.find(person => person.id === id).name}?`) !== false) {
    personService
      .deletePerson(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
        setMessage(`Deleted ${persons.find(person => person.id === id).name}`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })}}

  const Notification = ({ message }) => {
    if (message === null) {
      return null
    }
    return (
      <div className="notification">
        {message}
      </div>
    )
  }

  const ErrorNotification = ({ errorMessage }) => {
    if (errorMessage === null) {
      return null
    }
    return (
      <div className="error">
        {errorMessage}
      </div>
    )
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
      <Notification message={message} />
      <ErrorNotification errorMessage={errorMessage} />
      <Filter showBy={showBy} handlePersonsToShow={handlePersonsToShow} />
      <h3>Add a new</h3>
      <PersonForm addPerson={addPerson}
       newName={newName} 
       handlePersonChange={handlePersonChange} 
       newNumber={newNumber} 
       handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} deletePerson={deletePerson} />
    </div>
  )

}

export default App