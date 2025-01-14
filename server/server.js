// server/server.js
const express = require("express");
const path = require("path");

const PORT = process.env.PORT || 3000;
const app = express();
app.use(require("morgan")("dev"));
const pg = require("pg");

const DB_NAME = "acme_shop_db";
const TABLE_NAME = "flavors";

// create postgres database manually via console, or GUI - database name.
const client = new pg.Client(
  process.env.DATABASE_URL || `postgres://localhost/${DB_NAME}`
);
// const { client } = "./common";

// Middleware to parse JSON requests
app.use(express.json());
// Middleware to serve static files from client directory
app.use(express.static(path.join(__dirname, "../client")));

// app routes here

app.get("/", (req, res) => {
  res.status(200).json({ message: "This works" });
});

// DIST GET route.
// app.get('/', (req, res)=> res.sendFile(path.join(__dirname, '../client/dist/index.html')));

// GET all flavors
app.get("/api/flavors", async (req, res, next) => {
  console.log("GET ALL flavors");
  try {
    const SQL = `SELECT * FROM flavors;`;
    const response = await client.query(SQL);
    res.status(200).json(response.rows);
  } catch (error) {
    //   console.error(error);
    next(error);
  }
});

// ADD new flavor, returns added flavor.
app.post("/api/flavors", async (req, res, next) => {
  //   res.status(200).json({ message: "ADD flavor" });
  try {
    const { name, is_favorite } = req.body;

    const SQL = `;
        INSERT INTO ${TABLE_NAME}(name, is_favorite ) VALUES($1, $2) RETURNING *;
    `;

    const response = await client.query(SQL, [name, is_favorite || false]);
    res.status(200).json(response.rows);
  } catch (error) {
    next(error);
  }
});

// GET flavor: id
app.get("/api/flavors/:id", async (req, res, next) => {
  //   res.status(200).json({ message: "GET flavor" });
  try {
    const { id } = req.params;
    const SQL = `;
    SELECT * FROM ${TABLE_NAME} where id = $1;`;
    const response = await client.query(SQL, [id]);
    res.status(200).json(response.rows);
  } catch (error) {
    next(error);
  }
});

// UPDATE flavor: id
app.put("/api/flavors/:id", async (req, res, next) => {
  //   res.status(200).json({ message: "UPDATE flavor" });
  try {
    const { id } = req.params;
    const { name, is_favorite } = req.body;
    const SQL = `
          UPDATE ${TABLE_NAME} 
          SET name = $1, is_favorite = $2
          WHERE id = $3
          RETURNING *
      `;
    const response = await client.query(SQL, [name, is_favorite, id]);
    res.status(200).json(response.rows);
  } catch (error) {
    next(error);
  }
});

// DELETE flavor: id
app.delete("/api/flavors/:id", async (req, res, next) => {
  //   res.status(200).json({ message: "DELETE flavor" });
  try {
    const { id } = req.params;
    const SQL = `
        DELETE FROM ${TABLE_NAME} WHERE id = $1;
    `;
    await client.query(SQL, [id]);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

app.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT}`);
  await client.connect();
  // seed data.. could see with script to do it once, instead of initializing table every time.
  // try {
  //   await client.connect();
  //   const SQL = `DROP TABLE IF EXISTS ${TABLE_NAME};
  //        CREATE TABLE ${TABLE_NAME}(
  //         id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  //         name VARCHAR(100),
  //         is_favorite BOOLEAN DEFAULT FALSE,
  //         created_at TIMESTAMP DEFAULT NOW(),
  //         updated_at TIMESTAMP DEFAULT NOW(),
  //       );
  //           INSERT INTO ${TABLE_NAME}(name, is_favorite) VALUES('Chocolate', true);
  //           INSERT INTO ${TABLE_NAME} (name) VALUES('Vanilla');
  //           INSERT INTO ${TABLE_NAME} (name) VALUES('Coffee');
  //           INSERT INTO ${TABLE_NAME} (name) VALUES('Lemon Sorbet');
  //           INSERT INTO ${TABLE_NAME} (name) VALUES('Pistachio');
  //       `;
  //   await client.query(SQL);
  //   await client.end(); // close DB connection.
  //   console.log("We have flavored data..");
  // } catch (error) {
  //   console.error(error);
  // }
});
