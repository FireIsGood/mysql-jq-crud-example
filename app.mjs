"use strict";
import express from "express";
import { router as factRouter } from "./src/routes/facts.mjs";

const app = express();

const PORT = 1625;

app.use(express.json(), express.static("public"));

// Routes
app.use("/db", factRouter);

// Reset endpoint for testing only!!
app.get("/reset", (_req, res) => {
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

// Start the server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
