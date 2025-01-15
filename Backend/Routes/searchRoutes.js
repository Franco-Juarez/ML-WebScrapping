import express from 'express'
import { getAllProducts, getCheapestProducts, getProductById, createProductSearch, deleteSearchProduct, getProductSearchResults, updateProductSearch, getSearchId, getAllSearchIds } from '../Controllers/searchController.js'

const searchRoutes = express.Router()

searchRoutes.get('/products/cheapest-products/:searchId', getCheapestProducts)
searchRoutes.get('/products/:id', getProductById)
searchRoutes.get('/products/', getAllProducts)
searchRoutes.post('/search_product/:searchTerm', createProductSearch)
searchRoutes.put('/search_product/:searchTerm', updateProductSearch)
searchRoutes.get('/search_product/:searchId', getProductSearchResults)
searchRoutes.get('/product_searchId/:searchTerm', getSearchId)
searchRoutes.get('/product_searchId', getAllSearchIds)
searchRoutes.delete('/search_product/:searchId', deleteSearchProduct)

export default searchRoutes
