import express from "express";
import fs from "fs/promises";
import pg from "pg";
const app = express();
const port = 4000;

const db = new pg.Pool({
  host: "localhost",
  port: 5432,
  database: "petshop",
  user: "jadyn",
  password: "password",
});

app.get("/", (req, res) => {
  db.query("SELECT * FROM pets", [], (error, result) => {
    if (error) {
      throw error;
    }
    res.send(result.rows);
  });
});

///get all pets
app.get("/pets", (req, res) => {
  db.query("SELECT * FROM pets", []).then((result) => {
    res.send(result.rows);
  });
});

app.use(express.json());
app.post("/pets", (req, res) => {
  const { age, name, kind } = req.body;
  if (!kind || Number.isNaN(age) || !name) {
    res.sendStatus(422);
    return;
  }
  db.query(
    "INSERT INTO pets (name , age, kind) VALUES ($1, $2, $3) RETURNING *",
    [name, age, kind]
  ).then((result) => {
    res.status(201).send(result.rows[0]);
  });
});

app.get("/pets/:id", (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.sendStatus(422);
    return;
  }
  db.query("SELECT * FROM pets WHERE id = $1", [id]).then((result) => {
    if (result.rows.length === 0) {
      res.sendStatus(404);
    } else {
      res.send(result.rows[0]);
    }
  });
});

app.patch("/pets/:id", (req, res) => {
  const id = Number(req.params.id);
  const { name, age, kind } = req.body;
  if (Number.isNaN(id)) {
    res.sendStatus(422);
    return;
  }
  db.query(
    "UPDATE pets SET name = COALESCE($1, name), age = COALESCE($2, age), kind = COALESCE($3, kind) WHERE id = $4 RETURNING *",
    [name, age, kind, id]
  ).then((result) => {
    if (result.rows.length === 0) {
      res.sendStatus(404);
    } else {
      res.send(result.rows[0]);
    }
  });
});

app.delete("/pets/:id", (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.sendStatus(422);
    return;
  }
  db.query("DELETE FROM pets WHERE id = $1 RETURNING *", [id]).then(
    (result) => {
      if (result.rows.length === 0) {
        res.sendStatus(404);
      } else {
        res.send(result.rows[0]);
      }
    }
  );
});

app.listen(port, () => {
  console.log("Listening on port 4000");
});

// //look for requests with content type = application/json
// app.use(express.json());
// app.post("/pets", (req, res) => {
//   // get pet info from request body
//   const { age, name, kind } = req.body;
//   const pet = { age, name, kind };
//   //validation
//   if (!kind || !age || !name) {
//     //return 400 error
//     res.sendStatus(422);
//     return;
//   }

//   fs.readFile("pets.json", "utf8")
//     .then((data) => {
//       const pets = JSON.parse(data);
//       pets.push(pet);
//       return fs.writeFile("pets.json", JSON.stringify(pets));
//     })
//     .then(() => {
//       res.status(201).send(pet);
//     });
// });

///////////get pets at index
// app.get("/pets/:petIndex", (req, res) => {
//   const petIndex = Number(req.params.petIndex);
//   fs.readFile("pets.json", "utf8").then((data) => {
//     const pets = JSON.parse(data);
//   if (petIndex < 0 || petIndex >= pets.length) {
//       res.sendStatus(404);
//   }
//     res.send(pets[petIndex]);
//   });
// });

// /////////patch
// // app.patch("/pets/:petIndex", (req, res) => {
// //   const petIndex = Number(req.params.petIndex);

// //   fs.readFile("pets.json", "utf8")
// //     .then((data) => {
// //       const pets = JSON.parse(data);

// //       // Get the pet to update from the array
// //       const petToUpdate = pets[petIndex];

// //       // Update the pet information with the new values from the request body
// //       Object.assign(petToUpdate, req.body);

// //       // Write the updated pets array back to the pets.json file
// //       return fs.writeFile("pets.json", JSON.stringify(pets));
// //     })
// //     .then(() => {
// //       res.status(202).send(req.body);
// //     });
// // });

// app.patch("/pets/:petIndex", (req, res) => {
//   const petIndex = Number(req.params.petIndex);
//   const { name, kind, age } = req.body;
//   const ageNum = Number(age);
//   if ((!age && !kind && !name) || (age && Number.isNaN(ageNum))) {
//     res.sendStatus(422);
//     return;
//   }
//   fs.readFile("pets.json", "utf8").then((data) => {
//     const pets = JSON.parse(data);
//     if (petIndex < 0 && petIndex >= pets.length) {
//       res.sendStatus(404);
//       return;
//     }
//     const petToUpdate = pets[petIndex];
//     if (name) {
//       petToUpdate.name = name;
//     }
//     if (kind) {
//       petToUpdate.kind = kind;
//     }
//     if (age) {
//       petToUpdate.age = age;
//     }
//     fs.writeFile("pets.json", JSON.stringify(pets));
//     res.send(petToUpdate);
//   });
// });

// ////delete pets at index
// app.delete("/pets/:petIndex", (req, res) => {
//   const petIndex = Number(req.params.petIndex);

//   fs.readFile("pets.json", "utf8").then((data) => {
//     const pets = JSON.parse(data);
//     if (petIndex < 0 || petIndex >= pets.length) {
//       res.sendStatus(404);
//   }
//     const petToDelete = pets[petIndex];

//     pets.splice(petToDelete, 1);
//     fs.writeFile("pets.json", JSON.stringify(pets));
//     res.send(petToDelete);
//   });
// });
