import * as yup from 'yup'

const body = yup.object({
  author: yup.string().min(5).required(),
  title: yup.string().max(255).required(),
})

const params = yup.object({
  id: yup.string().trim().required()
})

export const CreateBookSchema = yup.object({ body })
export const ReadBookSchema = yup.object({ params })