import crypto from 'crypto'
import { validateProduct } from '../schemas/schemas.js'

class Product {
  constructor (name, price, url, freeShipping = false, productId) {
    const productData = {
      name,
      price,
      url,
      freeShipping,
      productId: productId || crypto.randomUUID()
    }

    const validatedProduct = validateProduct(productData)

    if (!validatedProduct.success) {
      // Construir un mensaje de error detallado
      const errorMessages = validatedProduct.error.issues
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join(', ')
      throw new Error(`Error al validar el producto: ${errorMessages}`)
    }

    // Asignar propiedades validadas
    const { name: validName, price: validPrice, url: validUrl, freeShipping: validFreeShipping, productId: validProductId } = validatedProduct.data

    this.name = validName
    this.price = validPrice
    this.url = validUrl
    this.freeShipping = validFreeShipping
    this.id = validProductId
  }

  // GETTERS
  getId () {
    return this.id
  }

  getName () {
    return this.name
  }

  getPrice () {
    return this.price
  }

  getUrl () {
    return this.url
  }

  getFreeShipping () {
    return this.freeShipping
  }

  // SETTERS
  setId (id) {
    this.id = id
  }

  setName (name) {
    this.name = name
  }

  setPrice (price) {
    this.price = price
  }

  setUrl (url) {
    this.url = url
  }

  setFreeShipping (freeShipping) {
    this.freeShipping = freeShipping
  }

  fromDatabase () {
    return new Product(this.name, this.price, this.url, this.freeShipping, this.id)
  }

  toDataBase () {
    return {
      productId: Buffer.from(this.getId().replace(/-/g, ''), 'hex'),
      name: this.getName(),
      price: this.getPrice(),
      url: this.getUrl(),
      freeShipping: this.getFreeShipping()
    }
  }
}

export default Product
