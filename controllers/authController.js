import validator from "validator";
import { dbConnection } from "../db/db.js";

export async function registerUser(req, res) {
  console.log(req.body)
  let { name, email, username, password } = req.body
  const regex = /^[a-zA-Z0-9_-]{1,20}$/;

  // Validat registeration input
  if(!name || !email || !username || !password) {
    return res.status(400).json({
      error: "All fields required."
    })
  }

  name = name.trim()
  email = email.trim()
  username = username.trim()

  if(!regex.test(username)) {
    return res.status(400).json({
      error: 'Username must be 1–20 characters, using letters, numbers, _ or -.'
    })
  }

  if(!validator.isEmail(email)) {
    return res.status(400).json({
      error: "Invalid email format"
    })
  }

  // Check and store valid new user
  try {
    const db = await dbConnection();

    const existingUser = await db.all(`
      SELECT username, email FROM users
      WHERE username = ? OR email = ?
    `, [username, email]);
    
    if (existingUser > 0) {
      return res.status(400).json({
        error: "Email or username already in use."
      })
    }

    await db.all(`
      INSERT INTO users (
      name, email, username, password)
      VALUES(?, ?, ?, ?)
    `, [name, email, username, password])

    return res.status(201).json({
      message: "User registered."
    })

  } catch (err) {

    console.error('Registration error:', err.message);

    res.status(500).json({ 
      error: 'Registration failed. Please try again.' 
    })

  }
}