import { dbConnection } from "../db/db.js";


export async function getGenres(req, res) {
  try {
    const db = await dbConnection();

    const allGenres = await db.all(`SELECT DISTINCT genre FROM products`);

    const genreList = allGenres.map(({genre}) => genre)

    return res.json(genreList)
  } catch (err) {
    
    return res.status(500).json({
      error: 'Failed to fetch genres', 
      details: err.message
    })

  } 
}

export async function getProducts(req, res) {
  
  try {
    const { genre, search } = req.query;
   
    const db = await dbConnection();

    let productsQuery = `SELECT * FROM products`

    let productsInput = [];

    if (genre) {
      productsQuery += ` WHERE genre = ?`
      productsInput.push(genre)
    } else if (search) {
      productsQuery += ` WHERE 
      (title || artist || genre)
      LIKE ?`
      productsInput.push(`%${search}%`)
    }

    const products = await db.all(productsQuery, productsInput);
   
    res.json(products)
  } catch (err) {

    return res.status(500).json({
      error: 'Failed to fetch products', 
      details: err.message
    })
    
  }
}
