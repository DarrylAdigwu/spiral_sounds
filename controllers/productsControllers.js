import { dbConnection } from "../db/db.js";


export async function getGenres(req, res) {
  try {
    const db = await dbConnection();
    const allGenres = await db.all(`SELECT DISTINCT genre FROM products`);
    const genreList = allGenres.map(({genre}) => genre)
    console.log(genreList)
    res.json(genreList)
  } catch (err) {
    // return res.status(500).json({
    //   error: 'Failed to fetch genres', 
    //   details: err.message
    // })
  }
}
getGenres()
export async function getProducts() {
  console.log("products")
}
