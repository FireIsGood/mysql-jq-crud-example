"use strict";
import express from "express";
import { router as factRouter } from "./src/routes/facts.mjs";

const app = express();

const PORT = 1625;

app.use(express.json(), express.static("public"));

// Routes
app.use("/db", factRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
