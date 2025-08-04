require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
morgan.token('body', (req) => JSON.stringify(req.body))
const logger = morgan('tiny', {skip: (req, res) => req.method !== 'POST'})
app.use(express.static('dist'))
app.use(express.json())
app.use(cors())
app.use(logger)
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
        console.log(error)
        response.status(400).send({ error: 'malformatted id'})
})

app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body

    Person.findByIdAndUpdate(
        request.params.id,
        { name, number },
        { new: true, runValidators: true, context: 'query' }
    )
        .then(updatedPerson => {
            response.json(updatedPerson.toJSON())
        })
        .catch(error => {
            next(error)
        })
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findByIdAndDelete(id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
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

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
