"use strict";
// -------------------------------------
// Tables
// -------------------------------------

// Loads data from a URL (wrapper of fetch)
export async function loadData(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw "URL error: " + (await res.text());
  }
  return await res.json();
}

// Sends a JSON conversion of values to the url via the method
export async function sendValues(url, values, method) {
  try {
    await fetch(url, {
      method,
      body: JSON.stringify(values),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    // Reload page on success
    window.location.reload();
  } catch (error) {
    console.warn(error);
  }
}

// Creates a table given an object structure:
// {
//   head: [...]
//   body: [
//     [...]
//     ...
//   ]
// }
export function makeTable(data) {
  let table = $("<table></table>");

  // head
  let thead = $("<thead></thead>").append("<tr></tr>");
  for (let col of data.head) {
    thead.children("tr").append($("<th></th>").text(col));
  }

  // body
  let tbody = $("<tbody></tbody>");
  for (let row of data.body) {
    let rowElem = $("<tr></tr>");
    for (let col of row) {
      // Special case if NULL
      if (col === null) {
        rowElem.append($("<td></td>").html("<em>NULL</em>"));
        continue;
      }
      rowElem.append($("<td></td>").text(col));
    }
    tbody.append(rowElem);
  }

  table.append(thead, tbody);

  return table;
}

// Loads a table and removes the `aria-busy` loading spinner
export async function loadTable(table, url, headers) {
  const data = await loadData(url);
  const newTable = makeTable({
    head: headers,
    body: data.map((entry) => Object.values(entry)),
  });
  $(table).attr("aria-busy", null);
  $(table).empty().append(newTable);
}

// -------------------------------------
// Forms
// -------------------------------------

// Loads the url ids into all <select> elements with the given name
export async function loadIds(name, url) {
  const factIds = await loadData(url);

  // Generate <option> markup
  const options = factIds.map(({ Id: id, Fact: fact }) =>
    $("<option></option>").attr("value", id).text(`(${id}) ${fact}`)
  );

  $(`[name='${name}']`).append(options); // (Appends to all matches, not just one!)
}

// Transforms an object's keys into the [name] values from a given form id
// e.g.
// {
//   firstName: "name",
//   age: "age",
// }
// might become
// {
//   firstName: "Olga"
//   age: 30,
// }
export function getFormVals(id, names) {
  return Object.fromEntries(Object.entries(names).map(([key, name]) => [key, $(id).find(`[name='${name}']`).val()]));
}

// Creates a form listener on the id to obtain values and send them to the url with the method
export function createFormListener(id, url, values, method) {
  $(id).on("submit", (e) => {
    e.preventDefault();
    const formVals = getFormVals(id, values);
    sendValues(url, formVals, method);
  });
}
