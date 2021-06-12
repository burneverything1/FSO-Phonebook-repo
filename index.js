require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')

/* whenever express gets a GET request it will first check if the build directory
contains a file corresponding to the request address
*/
app.use(express.static('build'))

app.use(express.json())
app.use(morgan('tiny'))         //logging with morgan

const cors = require('cors')
app.use(cors())

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info', (request, response) => {
    let currentDate = new Date()
    let phonebookLength = null

    Person.find({})
        .then(persons => {
            phonebookLength = persons.length;
            response.send(`Phonebook has info for ${phonebookLength} people <br> <br> ${currentDate}`)
        })    
})

app.get('/api/persons/:id', (request, response, next) => {
    Person
        .findById(request.params.id)
        .then(person => {
            if(person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
    Person
        .findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

const checkName = (name) => {
    let names = persons.map(person => person.name)
    return names.includes(name)
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    // check for content in post request
    if (!body.name || !body.number) {   // check if name or number is missing
        return response.status(400).json({
            error: 'content missing'
        })
    } else if (checkName(body.name)) {  // check if name exists in phonebook
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = new Person({         // mongodb model
        name: body.name,
        number: body.number
    })

    person
        .save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
})

//if user submits person whose name already exists, update number
app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person
        .findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

// custom middleware, if nothing else catches the request
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// error handler middleware
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})