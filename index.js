import express from "express";
import { configDotenv } from "dotenv";
import pkg from "pg";

const app = express();
configDotenv();

//Pool
const { Pool } = pkg; //Destructring

const KISHAN = new Pool({ connectionString: process.env.DATABASE_URL });

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Hello");
});

//read
app.get("/all", async (req, res) => {
  try {
    const { rows } = await KISHAN.query("SELECT * FROM books_to_read;");
    res.json(rows);
  } catch (error) {
    console.error("Failed to fetch books", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
