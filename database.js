const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const app = express();
const cors = require("cors");
app.use(cors());

app.use(express.json()); // Pour parser le JSON du body des requêtes
app.use(express.urlencoded({ extended: true }));

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

app.get("/search", (req, res) => {
  const ingredients = req.query.ingredients.split(",");
  connection.query(
    "SELECT DISTINCT Recettes.* FROM Recettes JOIN Contient ON Recettes.id_recette = Contient.id_recette JOIN Ingrédients ON Contient.id_aliment = Ingrédients.id_aliment WHERE Ingrédients.nom_aliment IN (?)",
    [ingredients],
    (err, rows) => {
      if (err) {
        console.error("Erreur lors de la récupération des recettes :", err);
        res.status(500).send("Erreur lors de la récupération des recettes");
        return;
      }
      console.log(rows); // Affiche le résultat de la requête dans la console
      res.send(rows);
    }
  );
});

app.post("/submitrecipe", (req, res) => {
  const { name, ingredients, description } = req.body;

  connection.beginTransaction((err) => {
    if (err) {
      console.error("Erreur lors de l'initialisation de la transaction :", err);
      res.status(500).send("Erreur lors de l'initialisation de la transaction");
      return;
    }

    connection.query(
      "INSERT INTO Recettes (nom_recette, description_recette) VALUES (?, ?)",
      [name, description],
      (err, result) => {
        if (err) {
          console.error("Erreur lors de l'insertion de la recette :", err);
          return connection.rollback(() => {
            res.status(500).send("Erreur lors de l'insertion de la recette");
          });
        }

        const recipeId = result.insertId;
        console.log("Recette insérée avec succès, ID:", recipeId);

        let ingredientPromises = ingredients.map((ingredient) => {
          return new Promise((resolve, reject) => {
            connection.query(
              "INSERT INTO Ingrédients (nom_aliment) VALUES (?) ON DUPLICATE KEY UPDATE id_aliment=LAST_INSERT_ID(id_aliment)",
              [ingredient],
              (err, result) => {
                if (err) {
                  return reject(err);
                }
                resolve(result.insertId);
              }
            );
          });
        });

        Promise.all(ingredientPromises)
          .then((ingredientIds) => {
            let containPromises = ingredientIds.map((ingredientId) => {
              return new Promise((resolve, reject) => {
                connection.query(
                  "INSERT INTO Contient (id_recette, id_aliment) VALUES (?, ?)",
                  [recipeId, ingredientId],
                  (err, result) => {
                    if (err) {
                      return reject(err);
                    }
                    resolve(result);
                  }
                );
              });
            });

            return Promise.all(containPromises);
          })
          .then(() => {
            connection.commit((err) => {
              if (err) {
                console.error("Erreur lors de la validation de la transaction :", err);
                return connection.rollback(() => {
                  res.status(500).send("Erreur lors de la validation de la transaction");
                });
              }
              res.json({ message: "Recette insérée avec succès" });
            });
          })
          .catch((err) => {
            console.error("Erreur lors de l'insertion des ingrédients ou des relations :", err);
            connection.rollback(() => {
              res.status(500).send("Erreur lors de l'insertion des ingrédients ou des relations");
            });
          });
      }
    );
  });
});

app.listen(3000, () => {
  console.log("Server is running at http://localhost:3000");
});
