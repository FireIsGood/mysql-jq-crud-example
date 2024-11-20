import express from "express";
import { pool, mysql } from "../database/db-connector.cjs";
import { validateData } from "../middleware/validateData.mjs";
import { z } from "zod";

export const router = express.Router();

// ROUTES

// Table ID views (for <select> elements)
router.get("/facts/ids", (_req, res) => {
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
router.get("/facts", (_req, res) => {
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
const factsPostSchema = z.object({
  fact: z.string(),
  truthfulness: z.string(),
  source: z.string(),
});
router.post("/facts", validateData(factsPostSchema), (req, res) => {
  const { fact, truthfulness, source } = req.body;
  pool.query(`
    INSERT INTO Facts (Fact, Truthfulness, Source)
    VALUES
      (${mysql.escape(fact)}, ${mysql.escape(truthfulness)}, ${mysql.escape(source)});
    `);
  res.status(201).send("Added!");
});

// UPDATE (U in CRUD)
const factsPatchSchema = z.object({
  id: z.coerce.number(),
  fact: z.string(),
  truthfulness: z.string(),
  source: z.string(),
});
router.patch("/facts", validateData(factsPatchSchema), (req, res) => {
  const { id, fact, truthfulness, source } = req.body;
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
const factsDeleteSchema = z.object({
  id: z.coerce.number(),
});
router.delete("/facts", validateData(factsDeleteSchema), (req, res) => {
  const { id } = req.body;
  pool.query(`
    DELETE FROM Facts
    WHERE
      Id = ${mysql.escape(id)};
    `);
  res.status(201).send("Deleted!");
});
