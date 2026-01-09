import express from "express";
import { productsRouter } from "./routes/products.js";
import { authRouter } from "./routes/auth.js";
import { meRouter } from "./routes/me.js";
import session from "express-session";
import dotenv from "dotenv";

const app = express();
const PORT = 3000;

dotenv.config()

app.use(express.json())

app.use(session({
  secret: process.env.SPIRAL_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: "lax"
  }
}))

app.use(express.static("public"));

app.use("/api/products", productsRouter);

app.use("/api/auth/me", meRouter);

app.use("/api/auth", authRouter);

app.use((req, res) => {
  res.status(404).json({
    message: "Page Not Found, sorry."
  })
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
}).on('error', (err) => {
  console.error('Failed to start server:', err)
});