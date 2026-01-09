import { dbConnection } from "../db/db.js";

export async function getCurrentUser(req, res) {
  try {
    const db = await dbConnection();
    const isLoggedIn = req.session.userId && true;
    if(!isLoggedIn) {
      return res.status(400).json({
        isLoggedIn: false
      })
    } 

    const getUsername = await db.get(`
      SELECT username 
      FROM users 
      WHERE id = ?
    `, [req.session.userId]);

    res.status(200).json({
      isLoggedIn: true,
      name: getUsername.username
    })
  } catch (err) {
    console.error('getCurrentUser error:', err);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
}