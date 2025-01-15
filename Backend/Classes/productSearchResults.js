import puppeteerService from '../Services/puppeteerServices.js'
import Product from './product.js'
import ProductSearch from './productSearch.js'

class ProductSearchResults {
  constructor (database) {
    this.database = database
  }

  async performSearch (searchTerm) {
    const productSearch = new ProductSearch(searchTerm)
    const productSearchToDataBase = productSearch.toDataBase()
    await this.database.insertProductSearch(productSearchToDataBase)
    const products = await puppeteerService(searchTerm)
    const productsId = []

    for (const productData of products) {
      const product = new Product(
        productData.title,
        productData.price,
        productData.url,
        productData.freeShipping
      )
      await this.database.insertProduct(product.toDataBase())
      productsId.push(product.getId())
    }

    await this.database.updateProductSearchResults(productsId, productSearchToDataBase.searchId)
    return productSearch
  }

  async updateSearch (searchTerm) {
    // Verificar si la búsqueda ya existe
    const [existingSearch] = await this.database.getProductSearchByTerm(searchTerm)
    const newSearch = new ProductSearch(existingSearch.searchTerm, existingSearch.searchDate, existingSearch.searchId)

    const productSearchToDataBase = newSearch.toDataBase()
    console.log(`Actualizando búsqueda con searchId: ${productSearchToDataBase.searchId}`)

    const products = await puppeteerService(searchTerm)
    const productsId = []

    for (const productData of products) {
      const product = new Product(
        productData.title,
        productData.price,
        productData.url,
        productData.freeShipping
      )

      // Verificar si el producto ya existe
      const existingProduct = await this.database.getProductByUrl(product.url)
      if (existingProduct) {
        productsId.push(existingProduct.productId)
      } else {
        await this.database.insertProduct(product.toDataBase())
        productsId.push(product.getId())
      }
    }

    // Actualizar los resultados de la búsqueda
    await this.database.updateProductSearchResults(productsId, productSearchToDataBase.searchId)

    return newSearch
  }
}

export default ProductSearchResults
