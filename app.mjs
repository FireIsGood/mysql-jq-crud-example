import express from "express";
import { pool, mysql } from "./database/db-connector.cjs";

let app = express();
const PORT = 1625;

app.use(express.json(), express.static("public"));

// ROUTES
app.get("/db", (_req, res) => {
  res.send("Hello");
});

// Reset endpoint for testing only!!
app.get("/db/reset", (_req, res) => {
  pool.query(`
    CREATE OR REPLACE TABLE Facts (
      Id INT NOT NULL AUTO_INCREMENT,
      Fact TEXT, Truthfulness TEXT,
      Source TEXT,
      PRIMARY KEY (Id)
    );`);
  pool.query(`
    INSERT INTO Facts (Fact, Truthfulness, Source)
    VALUES
      ("Fish are yellow", "Sometimes", "I thought about it"),
      ("Candy contains sugar", "No.", "Maybe?"),
      ("I am hungry", "Yes!!", "Me");
    `);
  res.send("Reset the DB");
});

// Table ID views (for <select> elements)
app.get("/db/facts/ids", (_req, res) => {
  pool.query(
    `
    SELECT Id, Fact FROM Facts;
    `,
    (err, results) => {
      if (err) res.status(400).send("Could not select!");
      res.send(JSON.stringify(results));
    }
  );
});

// READ (R in CRUD)
app.get("/db/facts", (_req, res) => {
  pool.query(
    `
    SELECT Fact, Truthfulness, Source FROM Facts;
    `,
    (err, results) => {
      if (err) res.status(400).send("Could not select!");
      res.send(JSON.stringify(results));
    }
  );
});

// CREATE (C in CRUD)
app.post("/db/facts", (req, res) => {
  // Check for errors in submission
  if (req.body === undefined) res.status(400).send("Invalid request.");

  const { fact, truthfulness, source } = req.body;

  if (fact === undefined || truthfulness == undefined || source == undefined) {
    res.status(400).send("You didn't supply all form entries!");
  }

  console.log("Creating: ", req.body);

  // Add it
  pool.query(`
    INSERT INTO Facts (Fact, Truthfulness, Source)
    VALUES
      (${mysql.escape(fact)}, ${mysql.escape(truthfulness)}, ${mysql.escape(source)});
    `);
  res.status(201).send("Added!");
});

// UPDATE (U in CRUD)
app.patch("/db/facts", (req, res) => {
  // Check for errors in submission
  if (req.body === undefined) res.status(400).send("Invalid request.");

  const { id, fact, truthfulness, source } = req.body;

  if (id === undefined || fact === undefined || truthfulness == undefined || source == undefined) {
    res.status(400).send("You didn't supply all form entries!");
  }

  console.log("Updating: ", req.body);

  // Update it
  pool.query(`
    UPDATE Facts
    SET
      Fact = ${mysql.escape(fact)},
      Truthfulness = ${mysql.escape(truthfulness)},
      Source = ${mysql.escape(source)}
    WHERE
      Id = ${mysql.escape(id)};
    `);
  res.status(201).send("Updated!");
});

// DELETE (D in CRUD)
app.delete("/db/facts", (req, res) => {
  // Check for errors in submission
  if (req.body === undefined) res.status(400).send("Invalid request.");

  const { id } = req.body;

  if (id === undefined) {
    res.status(400).send("You didn't supply all form entries!");
  }

  console.log("Deleting: ", req.body);

  // Remove it
  pool.query(`
    DELETE FROM Facts
    WHERE
      Id = ${mysql.escape(id)};
    `);
  res.status(201).send("Deleted!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
