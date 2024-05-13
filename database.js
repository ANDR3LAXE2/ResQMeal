const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const app = express();
const cors = require("cors");
app.use(cors());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "Projet_transverse")));

require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("Connexion réussie");
});

app.get("/ingredients", (req, res) => {
  connection.query("SELECT * FROM Ingrédients", (err, rows) => {
    if (err) {
      console.error(
        "Erreur lors de la récupération des données des aliments :",
        err
      );
      res.status(500).send("Erreur lors de la récupération des données");
      return;
    }
    res.send(rows);
  });
});

app.listen(3000, () => {
  console.log("Server is running at http://localhost:3000");
});
