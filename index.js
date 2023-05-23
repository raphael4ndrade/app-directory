import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'

// middlewares
import morgan from 'morgan'
import parser from 'body-parser'
import cors from 'cors'

import express from 'express'

import {
  CreateBookSchema,
  ReadBookSchema,
  UpdateBookSchema,
  DeleteBookSchema
} from './book.schema.js'
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
  const book = books[req.params.id]

  !!book ? res.send(book) : res.status(204).send()
})

app.put('/books/:id', validate(UpdateBookSchema), (req, res) => {
  const id = req.params.id
  const updatedBook = { ...books[id], ...req.body }

  books[id] = updatedBook

  res.send(200).send()
})

app.post('/books', validate(CreateBookSchema), (req, res) => {
  const id = randomUUID()
  books[id] = { id, ...req.body }

  res.status(201).send({ id })
})

app.delete('/books/:id', validate(DeleteBookSchema), (req, res) => {
  delete books[req.params.id]

  res.status(200).send()
})

app.listen(port, () => {
  console.log('App Direcory server running...')
})