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
