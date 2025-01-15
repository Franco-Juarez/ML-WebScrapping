import mysql from 'mysql2/promise'
import { validateDatabases } from '../schemas/schemas.js'

class DB {
  constructor (config) {
    const validateConfigData = validateDatabases(config)
    if (!validateConfigData.success) {
      throw new Error('Error en la validación de la configuración de la base de datos: ', validateConfigData.errors)
    }
    this.config = config
    this.connection = null
  }

  // Método para conectar a la base de datos
  async connect () {
    try {
      this.connection = await mysql.createConnection(this.config)
      console.log('Conexión a la base de datos exitosa.')
    } catch (error) {
      console.error('Error al conectar a la base de datos: ', error.message)
      throw error
    }
  }

  // Método para cerrar la conexión
  async close () {
    try {
      if (this.connection) {
        await this.connection.end()
        console.log('Conexión cerrada.')
      }
    } catch (error) {
      console.error('Error al cerrar la conexión:', error.message)
    }
  }

  _checkConnection () {
    if (!this.connection) {
      throw new Error('La conexión a la base de datos no está establecida. Llama a connect() primero.')
    }
  }

  async getConfig () {
    return this.config
  }

  // Método para realizar consultas
  async getAllProducts () {
    try {
      this._checkConnection()
      const [rows] = await this.connection.query('SELECT BIN_TO_UUID(productId) AS productId, name, price, url, freeShipping FROM products')
      return rows
    } catch (error) {
      console.error('Error al consultar la base de datos:', error.message)
      throw error
    }
  }

  // Método para obtener producto por id
  async getProductById (productId) {
    try {
      this._checkConnection()
      const query = 'SELECT BIN_TO_UUID(productId) AS productId, name, price, url, freeShipping FROM products WHERE BIN_TO_UUID(productId) = ?'
      const [result] = await this.connection.query(query, [productId])
      if (result.length === 0) {
        throw new Error(`No se encontró el producto con ID ${productId}`)
      }
      return result[0]
    } catch (error) {
      console.log(error.message)
      throw error
    }
  }

  async getProductByUrl (productUrl) {
    try {
      this._checkConnection()
      const query = 'SELECT BIN_TO_UUID(productId) AS productId, name, price, url, freeShipping FROM products WHERE url = ?'
      const [result] = await this.connection.query(query, [productUrl])
      if (result.length === 0) {
        return null
      }
      return result[0]
    } catch (error) {
      console.log(error.message)
      throw error
    }
  }

  // Método para insertar un producto
  async insertProduct (product) {
    try {
      this._checkConnection()
      const query = 'INSERT INTO products SET ?'
      await this.connection.query(query, product)
    } catch (error) {
      console.error('Error al insertar el producto en la base de datos:', error.message)
      throw error
    }
  }

  // Método para borrar un producto
  async deleteProduct (productId) {
    // BORRAR PRODUCTO DE LA BASE DE DATOS USANDO SQL
    try {
      this._checkConnection()
      const [result] = await this.connection.query('DELETE FROM products WHERE productId = ?', [productId])
      if (result.affectedRows === 0) {
        console.log(`No se encontró un producto con el ID ${productId} para borrar.`)
      } else {
        console.log(`El producto con ID ${productId} ha sido borrado.`)
      }
    } catch (err) {
      console.error('Error al borrar el producto: ', err.message)
    }
  }

  // Método para las tablas de búsqueda de productos

  async getAllProductsSearch () {
    try {
      this._checkConnection()
      const [rows] = await this.connection.query('SELECT BIN_TO_UUID(searchId) as searchId, searchTerm, searchDate FROM product_search')
      return rows
    } catch (error) {
      console.error('Error al obtener los resultados de búsqueda:', error.message)
      throw error
    }
  }

  async getProductSearch (searchId) {
    try {
      this._checkConnection()
      const query = 'SELECT BIN_TO_UUID(searchId) AS searchId, searchTerm, searchDate FROM product_search WHERE searchId = ?'
      const [rows] = await this.connection.query(query, [searchId])

      // Retorna la primera fila o null si no hay resultados
      return rows[0] || null
    } catch (error) {
      console.error('Error al obtener los resultados de búsqueda:', error.message)
      throw error
    }
  }

  async getAllSearchIds () {
    try {
      this._checkConnection()
      const [rows] = await this.connection.query('SELECT BIN_TO_UUID(searchId) as searchId FROM product_search')
      return rows
    } catch (error) {
      console.error('Error al obtener los ids de las búsquedas:', error.message)
      throw error
    }
  }

  async getProductSearchByTerm (searchTerm) {
    try {
      this._checkConnection()
      const query = 'SELECT searchTerm, searchDate, BIN_TO_UUID(searchId) AS searchId FROM product_search WHERE searchTerm = ?'
      const [rows] = await this.connection.query(query, [searchTerm])
      return rows
    } catch (error) {
      console.error('Error al obtener los resultados de búsqueda:', error.message)
      throw error
    }
  }

  // Método para insertar una búsqueda en la tabla de búsquedas
  async insertProductSearch (productSearch) {
    try {
      this._checkConnection()
      const query = 'INSERT INTO product_search (searchId, searchTerm, searchDate) VALUES (UUID_TO_BIN(?), ?, ?)'
      const { searchId, searchTerm, searchDate } = productSearch
      await this.connection.query(query, [searchId, searchTerm, searchDate])
      console.log(`La búsqueda ${productSearch.searchTerm} ha sido insertada en la base de datos.`)
    } catch (error) {
      console.error(error)
    }
  }

  // Método para actualizar una búsqueda en la tabla de búsquedas
  async updateProductSearch (productSearch) {
    try {
      this._checkConnection()
      const query = 'UPDATE product_search SET searchDate =? WHERE searchId = UUID_TO_BIN(?)'
      await this.connection.query(query, [productSearch.searchDate, productSearch.searchId])
      console.log(`La búsqueda ${productSearch.searchTerm} ha sido actualizada en la base de datos.`)
    } catch (error) {
      console.error(error)
    }
  }

  async deleteProductSearch (searchId) {
    try {
      this._checkConnection()
      const query = 'DELETE FROM product_search WHERE searchId = UUID_TO_BIN(?)'
      await this.connection.query(query, [searchId])
      console.log(`La búsqueda con el id: ${searchId} ha sido borrada de la base de datos.`)
    } catch (error) {
      console.error(error.message)
    }
  }

  // Método para gestionar la tabla de resultados de las búsquedas

  async getAllProductSearchResults () {
    try {
      this._checkConnection()
      const [rows] = await this.connection.query('SELECT * FROM product_search_results')
      return rows
    } catch (error) {
      console.error('Error al obtener los resultados de las búsquedas:', error.message)
      throw error
    }
  }

  async getProductSearchResults (searchId) {
    try {
      this._checkConnection()

      const query = `
        SELECT 
          BIN_TO_UUID(p.productId) AS productId, 
          p.name AS productName,
          p.price AS productPrice,
          p.url AS productUrl,
          p.freeShipping AS productFreeShipping
        FROM 
          product_search_results psr
        JOIN 
          products p ON psr.productId = p.productId
        WHERE 
          psr.searchId = UUID_TO_BIN(?)
      `

      const [rows] = await this.connection.query(query, [searchId])
      return rows
    } catch (error) {
      console.error('Error al obtener los resultados de la búsqueda:', error.message)
      throw error
    }
  }

  // Método para crear una tabla con los resultados de las búsquedas
  async updateProductSearchResults (productsId, searchId) {
    try {
      this._checkConnection()

      // Construir la consulta con placeholders
      const values = productsId.map(() => `(UUID_TO_BIN(?), UUID_TO_BIN(?))`).join(',')

      const query = `
        INSERT INTO product_search_results (searchId, productId)
        VALUES ${values}
        ON DUPLICATE KEY UPDATE searchId = VALUES(searchId)
      `
      // Construir los parámetros dinámicos
      const params = productsId.flatMap(productId => [searchId, productId])
      const [result] = await this.connection.query(query, params)

      console.log(`Se han actualizado ${result.affectedRows} filas en product_search_results.`)
    } catch (error) {
      console.error('Error al actualizar product_search_results:', error.message)
      throw error
    }
  }

  // Método para filtrar los 10 productos más baratos en una búsqueda particular
  async getCheapestProducts (searchId) {
    try {
      this._checkConnection()

      const query = `
        SELECT 
          BIN_TO_UUID(psr.productId) AS productId,
          p.name as productName,
          p.price as productPrice,
          p.freeShipping as productFreeShipping,
          p.url as productUrl
        FROM
          product_search_results psr
        JOIN 
          products p
        ON 
          psr.productId = p.productId
        WHERE 
          psr.searchId = UUID_TO_BIN(?)
        ORDER BY 
          p.price ASC
        LIMIT 10
      `

      const [result] = await this.connection.query(query, [searchId])

      if (result.length === 0) {
        console.error('No hay productos en la base de datos para este searchId')
        return []
      } else {
        return result
      }
    } catch (error) {
      console.error('Error al obtener los 10 productos más baratos:', error.message)
      throw error
    }
  }
}

export default DB
