import { dbConnection } from "../db/db.js"

export async function getAll(req, res){

}

export async function addToCart(req, res){
  if(!req.session.userId) {
    return res.status(401).json({
      message: "Not logged in"
    })
  }

  const productId = parseInt(req.body.productId, 10)


  try {
    const db = await dbConnection();

    const existingItem = await db.get(`
      SELECT * FROM cart_items
      WHERE user_id = ? AND product_id = ?
    `, [req.session.userId, Number(productId)])
    
    if(existingItem) {
      const updateItem = await db.run(`
        UPDATE cart_items
        SET quantity = quantity + 1
        WHERE id = ?
      `, [existingItem.id])

      return res.status(200).json({
        message: "Added to cart"
      })
    }
    
    await db.run(`INSERT INTO cart_items (user_id, product_id)
      VALUES (?, ?)
    `, [req.session.userId, productId])

    return res.status(200).json({
      message: "Added to cart"
    })
  } catch(err) {
    console.error(`Error adding to cart ${err.message}`)
    return res.status(400).json({
      error: `Invalid car item`
    })
  }


}

export async function deleteAll(req, res){

}

export async function deleteItem(req, res){

}

export async function getCount(req, res){

}