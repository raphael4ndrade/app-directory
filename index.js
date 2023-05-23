import fs from 'fs'
import path from 'path'

// middlewares
import morgan from 'morgan'
import parser from 'body-parser'
import cors from 'cors'

import express from 'express'
import { uuid } from 'uuidv4'

import { ReadBookSchema, CreateBookSchema } from './book.schema.js'
import __dirname from './dirname.js'

const app = express()
const port = 3000

// database
const books = {}

// logger
const logStream = fs.createWriteStream(
  path.join(__dirname, 'log', 'access.txt'),
  { flags: 'a' }
)

// setup middlewares
app.use(parser.json())
app.use(cors())
app.use(morgan('common', { stream: logStream }))

const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req)
    return next()
  } catch (error) {
    res.status(500).json({
      type: error.name,
      message: error.message,
    })
  }
}

app.get('/', (_, res) => {
  res.send('Welcome to App Directory!')
})

app.get('/books', (_, res) => {
  res.send(Object.values(books))
})

app.get('/books/:id', validate(ReadBookSchema), (req, res) => {
  let book = books[req.params.id]

  !!book ? res.send(book) : res.status(204).send()
})

app.post('/books', validate(CreateBookSchema), (req, res) => {
  const id = uuid()
  books[id] = { id, ...req.body }

  res.status(201).send({ id })
})

app.listen(port, () => {
  console.log('App Direcory server running...')
})