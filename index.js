import express from "express";
import { configDotenv } from "dotenv";
import pkg from "pg";

const app = express();
configDotenv();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

//post
app.post("/add", async (req, res) => {
  try {
    const { title, author } = req.body;
    const query =
      "INSERT INTO books_to_read(title,author) VALUES($1,$2) RETURNING *";
    const input = [title, author];
    const data = await KISHAN.query(query, input);
    res.json(data.rows);
  } catch (error) {
    console.log("Errror inserting books, Please try again");
    res.status(500).json(error);
  }
});

//put


//delete

//Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
