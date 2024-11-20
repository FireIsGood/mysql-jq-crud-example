import express from "express";
import { pool } from "../database/db-connector.cjs";
import { queryDb, sqlEscape as esc } from "../database/db-wrapper.mjs";
import { validateData } from "../middleware/validateData.mjs";
import { z } from "zod";

export const router = express.Router();

// ROUTES

// Table ID views (for <select> elements)
router.get("/facts/ids", (_req, res) => {
  queryDb(
    pool,
    `
    SELECT Id, Fact FROM Facts;
    `,
    res
  );
});

// READ (R in CRUD)
router.get("/facts", (_req, res) => {
  queryDb(
    pool,
    `
    SELECT Fact, Truthfulness, Source FROM Facts;
    `,
    res
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
  queryDb(
    pool,
    `
    INSERT INTO Facts (Fact, Truthfulness, Source)
    VALUES
      (${esc(fact)}, ${esc(truthfulness)}, ${esc(source)});
    `,
    res
  );
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
  queryDb(
    pool,
    `
    UPDATE Facts
    SET
      Fact = ${esc(fact)},
      Truthfulness = ${esc(truthfulness)},
      Source = ${esc(source)}
    WHERE
      Id = ${esc(id)};
    `,
    res
  );
});

// DELETE (D in CRUD)
const factsDeleteSchema = z.object({
  id: z.coerce.number(),
});
router.delete("/facts", validateData(factsDeleteSchema), (req, res) => {
  const { id } = req.body;
  queryDb(
    pool,
    `
    DELETE FROM Facts
    WHERE
      Id = ${esc(id)};
    `,
    res
  );
});
