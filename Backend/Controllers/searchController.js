import * as productService from '../Services/productServices.js'

const createProductSearch = async (req, res) => {
  try {
    const searchTerm = req.params.searchTerm
    await productService.createProductSearchService(searchTerm)
    res.status(201).json({ message: 'Búsqueda de producto agregada con éxito.' })
  } catch (error) {
    console.error('Error al crear la búsqueda de producto:', error.message)
    res.status(500).json({ message: 'Error al crear la búsqueda. Inténtelo nuevamente más tarde.' })
  }
}

const updateProductSearch = async (req, res) => {
  try {
    const searchTerm = req.params.searchTerm
    await productService.updateProductSearchResults(searchTerm)
    res.status(200).json({ message: 'Búsqueda de producto actualizada con éxito.' })
  } catch (error) {
    console.error('Error al actualizar la búsqueda de producto:', error.message)
    res.status(500).json({ message: 'Error al actualizar la búsqueda. Inténtelo nuevamente más tarde.' })
  }
}

const getProductSearchResults = async (req, res) => {
  try {
    const searchId = req.params.searchId
    const products = await productService.getProductSearchResults(searchId)
    if (products.length === 0) {
      res.status(404).json({ message: 'No se encontraron resultados para esta búsqueda.' })
    } else {
      res.status(200).json(products)
    }
  } catch (error) {
    console.error('Error al buscar resultados:', error.message)
    res.status(500).json({ message: 'Error interno del servidor.' })
  }
}

const getSearchId = async (req, res) => {
  try {
    const searchTerm = req.params.searchTerm
    const searchId = await productService.getSearchIdServices(searchTerm)
    if (searchId.length === 0) {
      res.status(404).json({ message: 'No se encontraron resultados para esta búsqueda del searchId' })
    } else {
      res.status(200).json(searchId)
    }
  } catch (error) {
    console.error('Error al buscar la búsqueda:', error.message)
    res.status(500).json({ message: 'Error interno del servidor.' })
  }
}

const getAllSearchIds = async (req, res) => {
  try {
    const searchIds = await productService.gettAllSearchIdsServices()
    if (searchIds.length === 0) {
      res.status(404).json({ message: 'No se encontraron búsquedas.' })
    } else {
      res.status(200).json(searchIds)
    }
  } catch (error) {
    console.error('Error al buscar todas las búsquedas:', error.message)
    res.status(500).json({ message: 'Error interno del servidor.' })
  }
}

const deleteSearchProduct = async (req, res) => {
  try {
    const searchId = req.params.searchId
    await productService.deleteProductSearchService(searchId)
    res.status(200).json({ message: 'Búsqueda de producto eliminada con éxito.' })
  } catch (error) {
    console.error('Error al crear el producto:', error.message)
    res.status(500).json({ message: 'Error al crear la búsqueda. Inténtelo nuevamente más tarde.' })
  }
}

const getCheapestProducts = async (req, res) => {
  try {
    const searchId = req.params.searchId
    const products = await productService.getCheapestProducts(searchId)
    if (products.length === 0) {
      res.status(404).json({ message: 'No se encontraron artículos.' })
    } else {
      res.status(200).json(products)
    }
  } catch (error) {
    console.error('Error al buscar artículos:', error.message)
    res.status(500).json({ message: 'Error interno del servidor.' })
  }
}

const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts()
    if (products.length === 0) {
      res.status(404).json({ message: 'No se encontraron artículos.' })
    } else {
      res.status(200).json(products)
    }
  } catch (error) {
    console.error('Error al buscar artículos:', error.message)
    res.status(500).json({ message: 'Error interno del servidor.' })
  }
}

// REVISAR SI TIENE SENTIDO MANTENER ESTA FUNCIONALIDAD
const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id)
    if (!product) {
      res.status(404).json({ message: 'El producto no fue encontrado.' })
    } else {
      res.status(200).json(product)
    }
  } catch (error) {
    console.error('Error al buscar producto:', error.message)
    res.status(500).json({ message: 'Error interno del servidor.' })
  }
}

export { getCheapestProducts, getAllProducts, getProductById, createProductSearch, deleteSearchProduct, getProductSearchResults, updateProductSearch, getSearchId, getAllSearchIds }
