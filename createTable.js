import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "node:path";

async function createTable() {
  const db = await open({
    filename: path.join('database.db'),
    driver: sqlite3.Database
  })

  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
        `)

      await db.exec(`
        CREATE TABLE cart_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          product_id INTEGER NOT NULL,
          quantity INTEGER NOT NULL DEFAULT 1,
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (product_id) REFERENCES products(id)
        )
     `)
  } catch (err) {
    console.error(err)
  } finally {
    await db.close()
  }

  console.log("Table created");
}

createTable()