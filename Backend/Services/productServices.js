import DB from '../Classes/db.js'
import dotenv from 'dotenv'
import ProductSearchResults from '../Classes/productSearchResults.js'
import cron from 'node-cron'

dotenv.config()
const db = new DB({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE
})

db.connect().then(() => {
  console.log('Base de datos conectada')
}).catch((error) => {
  console.error('Error al conectar a la base de datos', error.message)
})

// CRON JOB FOR updating product search results

cron.schedule('0 0 * * *', async () => {
  console.log('Cron job ejecutado')
  try {
    const searchProducts = await db.getAllProductsSearch()
    for (const search of searchProducts) {
      try {
        await updateProductSearchResults(search.searchTerm)
      } catch (error) {
        console.error(`Error al actualizar resultados para ${search.searchTerm}:`, error.message)
      }
    }
  } catch (error) {
    console.error('Error al obtener productos:', error.message)
  }
})

const createProductSearchService = async (searchTerm) => {
  try {
    const productSearchResults = new ProductSearchResults(db)
    await productSearchResults.performSearch(searchTerm)
  } catch (error) {
    console.error(error.message)
    throw new Error('Error al crear la búsqueda de producto')
  }
}

const getSearchIdServices = async (searchTerm) => {
  const productsSearch = await db.getProductSearchByTerm(searchTerm)
  const searchId = productsSearch[0].searchId
  return searchId
}

const gettAllSearchIdsServices = async () => {
  try {
    const searchIds = db.getAllSearchIds()
    return searchIds
  } catch (error) {
    console.error(error.message)
    throw new Error('Error al obtener IDs de búsquedas')
  }
}

const updateProductSearchResults = async (searchTerm) => {
  try {
    const productSearchResults = new ProductSearchResults(db)
    await productSearchResults.updateSearch(searchTerm)
  } catch (error) {
    console.error(error.message)
    throw new Error('Error al actualizar resultados de búsqueda')
  }
}

const getProductSearchResults = async (searchId) => {
  try {
    return await db.getProductSearchResults(searchId)
  } catch (error) {
    console.error(error.message)
    throw new Error('Error al obtener resultados de búsqueda')
  }
}

const deleteProductSearchService = async (searchId) => {
  try {
    await db.deleteProductSearch(searchId)
  } catch (error) {
    console.error(error.message)
    throw new Error('Error al eliminar búsqueda de producto')
  }
}

const getCheapestProducts = async (searchId) => {
  try {
    return await db.getCheapestProducts(searchId)
  } catch (error) {
    console.error(error.message)
    throw new Error('Error al obtener los productos más baratos')
  }
}

const getAllProducts = async () => {
  try {
    return await db.getAllProducts()
  } catch (error) {
    console.error(error.message)
    throw new Error('Error al obtener todos los productos')
  }
}

const getProductById = async (id) => {
  try {
    return await db.getProductById(id)
  } catch (error) {
    console.error(error.message)
    throw new Error('Error al obtener el producto por ID')
  }
}

const insertProduct = async (product) => {
  try {
    return await db.insertProduct(product)
  } catch (error) {
    console.error(error.message)
    throw new Error('Error al insertar el producto')
  }
}

export { getCheapestProducts, getAllProducts, getProductById, insertProduct, createProductSearchService, deleteProductSearchService, getProductSearchResults, updateProductSearchResults, getSearchIdServices, gettAllSearchIdsServices }
