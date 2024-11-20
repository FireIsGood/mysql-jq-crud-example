"use strict";
import { mysql } from "./db-connector.cjs";

export const sqlEscape = mysql.escape;

export function queryDb(pool, queryString, res) {
  pool.query(queryString, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error processing SQL statement!");
    }

    // All good!
    res.status(200).send(JSON.stringify(results));
  });
}
