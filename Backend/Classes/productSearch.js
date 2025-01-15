import crypto from 'crypto'
import { validateProductSearch } from '../schemas/schemas.js'

class ProductSearch {
  constructor (searchTerm, searchDate = new Date(), id) {
    const searchData = {
      searchTerm,
      searchDate,
      id: id || crypto.randomUUID()
    }

    const validationResult = validateProductSearch(searchData)

    if (!validationResult.success) {
      // Mostrar mensajes de error detallados
      const errorMessages = validationResult.error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join(', ')
      throw new Error(`Error al validar los datos de la búsqueda: ${errorMessages}`)
    }

    // Si la validación pasa, asignar los datos
    this.searchTerm = validationResult.data.searchTerm
    this.searchDate = validationResult.data.searchDate
    this.id = validationResult.data.id
  }

  getId () {
    return this.id
  }

  getSearchTerm () {
    return this.searchTerm
  }

  getSearchDate () {
    return this.searchDate
  }

  setId (id) {
    this.id = id
  }

  setSearchTerm (searchTerm) {
    this.searchTerm = searchTerm
  }

  setSearchDate (searchDate) {
    this.searchDate = searchDate
  }

  fromDatabase () {
    return new ProductSearch(this.searchTerm, new Date(this.searchDate), this.id)
  }

  toDataBase () {
    return {
      searchTerm: this.getSearchTerm(),
      searchDate: this.getSearchDate(),
      searchId: this.getId()
    }
  }
}

export default ProductSearch
