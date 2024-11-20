import { createFormListener, loadIds, loadTable } from "./util.js";

$(async function () {
  // Load table
  await loadTable("#facts", "/db/facts", ["Fact", "Is this true?", "Source"]);

  // Load IDs
  loadIds("fact-id", "/db/facts/ids");

  // Set up form listeners
  createFormListener(
    "#add-fact",
    "/db/facts",
    { fact: "fact", truthfulness: "truthfulness", source: "source" },
    "POST"
  );
  createFormListener(
    "#update-fact",
    "/db/facts",
    { id: "fact-id", fact: "fact", truthfulness: "truthfulness", source: "source" },
    "PATCH"
  );
  createFormListener(
    //
    "#delete-fact",
    "/db/facts",
    { id: "fact-id" },
    "DELETE"
  );
});
