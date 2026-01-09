import sqlit3 from "sqlite3";
import { open } from "sqlite";
import path from "node:path";


export async function dbConnection() {

  const dbPath = path.join('database.db');
  
  try {
    return open({
      filename: dbPath,
      driver: sqlit3.Database
    })
  } catch (err) {
    console.error(`Error opening connection to database ${err.message}`)
  }
}