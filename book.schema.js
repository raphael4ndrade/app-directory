import * as yup from 'yup'

const params = yup.object({
  id: yup.string().trim().required()
})

export const CreateBookSchema = yup.object({
  body: yup.object({
    author: yup.string().trim().min(5).required(),
    title: yup.string().trim().max(255).required(),
  })
})

export const ReadBookSchema = yup.object({ params })

export const UpdateBookSchema = yup.object({
  params,
  body: yup.object({
    author: yup.string().trim().min(5),
    title: yup.string().trim().max(255),
  })
})

export const DeleteBookSchema = yup.object({ params })