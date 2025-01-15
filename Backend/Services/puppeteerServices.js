import puppeteer from 'puppeteer'

const puppeteerService = async (product) => {
  let browser
  try {
    browser = await puppeteer.launch({
      headless: true
    })
  } catch (error) {
    console.error(error.message)
    throw new Error('Error al comenzar el navegador')
  }

  if (!product || typeof product !== 'string') {
    throw new Error('El producto debe ser una cadena no vacía')
  }

  const page = await browser.newPage()
  await page.goto('https://www.mercadolibre.com.ar/') // Navega a la página

  await page.waitForSelector('.nav-search-input') // Espera a que cargue el selector
  await page.type('.nav-search-input', `'${product}'`) // Escribe en el input
  await page.click('.nav-search-btn') // Hace clic en el botón

  await page.waitForSelector('.ui-search-sidebar h1') // Espera a que cargue el selector

  const results = await page.evaluate(() => {
    const searchTitle = document.querySelector('.ui-search-sidebar h1').innerText
    const numberOfResults = document.querySelector('.ui-search-search-result__quantity-results').innerText

    // Captura y formatea los precios
    const prices = Array.from(document.querySelectorAll('.poly-price__current .andes-money-amount__fraction')).map(
      (price) => {
        const rawPrice = price.innerText
        const formattedPrice = parseFloat(rawPrice.replace(/\./g, '').replace(',', '.'))
        return parseFloat(formattedPrice.toFixed(2)) // Limitar a 2 decimales
      }
    )

    // Captura los títulos
    const titles = Array.from(document.querySelectorAll('.poly-component__title')).map(
      (link) => link.innerText
    )

    // Captura las URLs
    const urls = Array.from(document.querySelectorAll('.poly-component__title')).map(
      (link) => link.href
    )

    // Captura si tiene envío gratis
    const freeShipping = Array.from(document.querySelectorAll('.poly-component__shipping')).map(
      (shipping) => shipping.innerText.includes('Envío gratis')
    )

    return {
      searchTitle,
      numberOfResults,
      prices,
      urls,
      freeShipping,
      titles
    }
  })

  console.log(results.searchTitle, results.numberOfResults)
  // Armar un objeto por cada artículo
  const uniqueUrls = new Set(results.urls)

  // Obtiene la cantidad de URLs únicas
  const uniqueUrlCount = uniqueUrls.size

  const articles = []

  for (let i = 0; i < uniqueUrlCount; i++) {
    articles.push({
      title: results.titles[i] || 'Título no disponible',
      price: results.prices[i] || 'Precio no disponible',
      url: results.urls[i] || 'URL no disponible',
      freeShipping: results.freeShipping[i] !== undefined ? results.freeShipping[i] : false
    })
  }

  await browser.close()
  return articles
}

export default puppeteerService
