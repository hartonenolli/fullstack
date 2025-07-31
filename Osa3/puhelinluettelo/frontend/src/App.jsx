import axios from 'axios'
import { useState, useEffect } from 'react'
import PersonsService from './services/persons'
const baseUrl = '/api/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterBy, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [colorMessage, setColorMessage] = useState('green')

  useEffect(() => {
    PersonsService.getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => {
        console.error('Error fetching persons:', error)
      })
    }, [])


  const addName = (event) => {
    event.preventDefault()
    //console.log('button clicked', newName)
    const names = persons.map(person => person.name)
    //console.log('names', names);
    const personObject = {
      name: newName,
      number: newNumber
    }
    if (names.includes(newName)) {
      const confirmUpdate = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      if (confirmUpdate) {
        const personToUpdate = persons.find(person => person.name === newName)
        PersonsService.updatePerson(personToUpdate.id, personObject)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== personToUpdate.id ? p : returnedPerson))
            setMessage(`Updated ${returnedPerson.name}`)
            setColorMessage('green')
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
        } else {
            console.log(`Update of ${newName} cancelled`)
          }
      } else {
        PersonsService.addPerson(personObject)
          .then(returnedPerson => {
            setPersons(persons.concat(returnedPerson))
          })
        setMessage(`Added ${newName}`)
        setColorMessage('green')
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      }
      setNewName('')
      setNewNumber('')
  }

  const handleNameChange = (event) => {
    //console.log('value changed', event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    //console.log('value changed', event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    //console.log('filter changed', event.target.value)
    setFilter(event.target.value)
  }

  const handleDelete = (person) => {
    const confirmDelete = window.confirm(`Delete ${person.name}?`)
      ? PersonsService.deletePerson(person.id).then(() => {
          setPersons(persons.filter(p => p.id !== person.id))
          setMessage(`Deleted ${person.name}`)
          setColorMessage('green')
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch(error => {
          setMessage(`Information of ${person.name} has already been removed from the server`)
          setColorMessage('red')
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
      : console.log(`Deletion of ${person.name} cancelled`)
    setNewName('')
    setNewNumber('')
    setFilter('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} colorMessage={colorMessage} />
      <Filter filterBy={filterBy} handleFilterChange={handleFilterChange} />
      <h2>Add a new</h2>
      <PersonForm 
        newName={newName} 
        newNumber={newNumber} 
        handleNameChange={handleNameChange} 
        handleNumberChange={handleNumberChange} 
        addName={addName}
      />
      <h2>Numbers</h2>
      <Numbers persons={persons} filterBy={filterBy} handleDelete={handleDelete} />
    </div>
  )

}

const Filter = ({ filterBy, handleFilterChange }) => {
  return (
    <div>
      filter shown with <input value={filterBy} onChange={handleFilterChange} />
    </div>
  )
}

const PersonForm = ({ newName, newNumber, handleNameChange, handleNumberChange, addName }) => {
  return (
    <form onSubmit={addName}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
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

const Numbers = ({ persons, filterBy, handleDelete }) => {
  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filterBy.toLowerCase()))
  return (
    <ul>
      {filteredPersons.map(person => 
        <li key={person.name}>
          {person.name} {person.number}
          <button onClick={() => handleDelete(person)} >delete</button>
        </li>
      )}
    </ul>
  )
}

const Notification = ({ message, colorMessage }) => {
  const style = {
    color: colorMessage,
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5
  }
  if (message === null) {
    return null
  }
  return (
    <div style={style}>
      {message}
    </div>
  )
}

export default App