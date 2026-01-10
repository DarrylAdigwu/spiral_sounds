import { dbConnection } from "../db/db.js"

export async function getAll(req, res){

  if (!req.session.userId) {
    return res.json({err: 'not logged in'})
  }

  const db = await dbConnection();

  try {
    const allItems = await db.all(`
      SELECT CI.id AS cartItemId, quantity, title, artist, price FROM cart_items CI
      INNER JOIN products P ON CI.product_id = P.id
      WHERE CI.user_id = ?
    `, [req.session.userId])

    return res.status(200).json({
      items: allItems
    })
  } catch(err) {
    console.error(`Error getting cart all items ${err.message}`)
    return res.status(400).json({
      error: `Invalid request`
    })
  }
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


export async function getCartCount(req, res){
  if(!req.session.userId) {
    return res.status(401).json({
      error: "Not logged in"
    })
  }
  const db = await dbConnection();

  try {
    const cartItems = await db.get(`
      SELECT SUM(quantity) AS cart_total FROM cart_items
      WHERE user_id = ?
    `, [req.session.userId])

    const cartTotal = cartItems.cart_total > 0 ? cartItems.cart_total : 0;

    return res.status(200).json({
      totalItems: cartTotal
    })
  } catch (err) {
    console.error(`Error getting cart count ${err.message}`)
    return res.status(400).json({
      error: `Cart items are not available`
    })
  }
}


export async function deleteAll(req, res){
  if(!req.session.userId) {
    return res.status(401).json({
      message: "Not logged in"
    })
  }

  const db = await dbConnection();

  try {
  await db.run(`DELETE FROM cart_items WHERE user_id = ?`, [req.session.userId])

    return res.status(204).send()
  } catch (err) {
    console.error(`Error removing items ${err.message}`)
    return res.status(400).json({
      error: `Removing all items from cart`
    })
  }
}

export async function deleteItem(req, res){
  if(!req.session.userId) {
    return res.status(401).json({
      message: "Not logged in"
    })
  }

  const itemId = req.params.itemId;

  if(isNaN(itemId)) {
    return res.status(400).json({error: 'Invalid item ID'})
  }

  const db = await dbConnection();

  try{
    const item = await db.get(`
      SELECT quantity FROM cart_items
      WHERE id = ? AND user_id = ?
    `, [itemId, req.session.userId])

    if(!item) {
      return res.status(400).json({error: 'Item not found'})
    }

    await db.run(`
      DELETE FROM cart_items
      WHERE user_id = ? AND id = ?
    `, [req.session.userId, itemId])

    return res.status(204).send()
  } catch(err) {
    console.error(`Error getting deleting item ${err.message}`)
    return res.status(400).json({
      error: `Cart items can not be deleted`
    })
  }
}