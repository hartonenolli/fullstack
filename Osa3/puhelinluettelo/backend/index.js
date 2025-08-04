require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
morgan('tiny')
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(express.json())
app.use(express.static('dist'))
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


let persons = []

Person.find({})
    .then(result => {
        persons = result.map(person => person.toJSON())
        console.log('Initial persons loaded from database:', persons)
    })
    .catch(error => {
        console.error('Error loading persons from database:', error.message)
    })

app.get('/', (request, response) => {
    response.send('<h1>Puhelinluettelo!</h1>')
  })

app.get('/info', (request, response) => {
    const info = `<p>Phonebook has info for ${persons.length} people</p>`
    const date = `<p>${new Date()}</p>`
    response.send(info + date)
})

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})

app.get('api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findById(id)
        .then(person => {
            if (person) {
                response.json(person.toJSON())
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

// app.get('/api/persons/:id', (request, response) => {
//     const id = Number(request.params.id)
//     const person = persons.find(p => p.id === id)
//     if (person) {
//         response.json(person)
//     } else {
//         response.status(404).end()
//     }
// })

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({ error: 'Name or number is missing' })
    }
    const newPerson = new Person({
        name: body.name,
        number: body.number
    })
    newPerson.save()
        .then(savedPerson => {
            response.json(savedPerson.toJSON())
        })
        .catch(error => {
            next(error)
        })
})

// app.post('/api/persons', (request, response) => {
//     const body = request.body
//     console.log('Received body:', body);
//     const generateId = () => {
//         return randomID = Math.floor(Math.random() * 10000)
//     }
//     const newPerson = {
//         id: generateId(),
//         name: body.name,
//         number: body.number
//     }
//     if (personCheck(newPerson)) {
//         return response.status(400).json(personCheck(newPerson))
//     }
//     console.log('Adding new person:', newPerson);
//     console.log('Current persons:', persons);

//     persons = persons.concat(newPerson)
//     response.json(newPerson)
// })

// const personCheck = (newPerson) => {
//     const existingPerson = persons.find(p => p.name === newPerson.name)
//     if (existingPerson) {
//         return { error: 'Name must be unique' }
//     }
//     if (!newPerson.name || !newPerson.number) {
//         return { error: 'Name or number is missing' }
//     }
//     return null
// }

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
