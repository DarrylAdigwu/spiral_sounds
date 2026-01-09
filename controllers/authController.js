import validator from "validator";
import { dbConnection } from "../db/db.js";
import bcrypt from "bcryptjs";

export async function registerUser(req, res) {
 
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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.run(`
      INSERT INTO users (
      name, email, username, password)
      VALUES(?, ?, ?, ?)
    `, [name, email, username, hashedPassword])

    req.session.userId = result.lastID;
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

export async function loginUser(req, res) {

  let { username, password } = req.body
  const regex = /^[a-zA-Z0-9_-]{1,20}$/;

  
  // Validat registeration input
  if(!username || !password) {
    return res.status(400).json({
      error: "All fields are required"
    })
  }

  username = username.trim()

  if(!regex.test(username)) {
    return res.status(400).json({
      error: 'Username must be 1–20 characters, using letters, numbers, _ or -.'
    })
  }

  try {
    const db = await dbConnection();

    const validateUser = await db.get(`
      SELECT id, username, password FROM users
      WHERE username = ?
    `, [username])

    if(!validateUser) {
      return res.status(400).json({
        error: "Invalid credentials"
      })
    }

    const comparePassword = await bcrypt.compare(password, validateUser.password)
    
    if(!comparePassword) {
      return res.status(400).json({
        error: "Invalid credentials"
      })
    }

    req.session.userId = validateUser.id;

    return res.status(201).json({
      message: "Logged in"
    })


  } catch (err) {
    console.error('Login error:', err.message)
    res.status(500).json({ 
      error: 'Login failed. Please try again.' 
    })
  }
}