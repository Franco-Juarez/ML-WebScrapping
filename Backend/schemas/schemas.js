import { z } from 'zod'

const productSchema = z.object({
  name: z.string().min(1, { message: 'El nombre de producto no puede estar vacío' }),
  price: z.number().positive({ message: 'El precio debe ser un número positivo' }),
  url: z.string().url({ message: 'La URL es inválida' }),
  freeShipping: z.boolean().optional(),
  productId: z.string().uuid({ message: 'El UUID es inválido' }).optional()
})

const productSearchSchema = z.object({
  searchTerm: z.string().min(1, 'Search term cannot be empty'),
  searchDate: z.preprocess((val) => {
    const date = val instanceof Date ? val : new Date(val)
    return date.toISOString().slice(0, 19).replace('T', ' ')
  }, z.string()),
  id: z.string().uuid().optional()
})

const databaseSchema = z.object({
  host: z.string().nonempty('El host no puede estar vacío'),
  user: z.string().nonempty('El usuario no puede estar vacío'),
  port: z.preprocess((val) => Number(val), z.number().positive().default(3306)),
  password: z.string().optional(),
  database: z.string().nonempty('El nombre de la base de datos no puede estar vacío')
})

const validateProduct = (product) => {
  return productSchema.safeParse(product)
}

const validateProductSearch = (productSearch) => {
  return productSearchSchema.safeParse(productSearch)
}

const validateDatabases = (databases) => {
  return databaseSchema.safeParse(databases)
}

export {
  validateProduct,
  validateProductSearch,
  validateDatabases
}
