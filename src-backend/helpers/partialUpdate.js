/**
 * Generate a selective update query based on a request body:
 *
 * - table: where to make the query
 * - items: the list of columns you want to update
 * - key: the column that we query by (e.g. username, handle, id)
 * - id: current record ID associated with the key above.
 *
 * Returns object containing a DB query as a string, and array of
 * string values to be updated
 *
 *  Example:
 *   sqlForPartialUpdate("users", {first_name: "Joe", last_name: "Smith"}, "username", "jsmith")
 *  Returns:
 *   {query: "UPDATE users SET first_name=$1, last_name=$2 WHERE username=$3 RETURNING *",
 *   values: ["Joe", "Smith", "jsmith"]}
 * 
 */

function sqlForPartialUpdate(table, items, key, id) {
  let idx = 1;
  let columns = [];

  for (let column in items) {
    columns.push(`${column}=$${idx}`);
    idx += 1;
  }

  // build query
  let cols = columns.join(", ");
  let query = `UPDATE ${table} SET ${cols} WHERE ${key}=$${idx} RETURNING *`;

  let values = Object.values(items);
  values.push(id);

  return { query, values };
};

module.exports = sqlForPartialUpdate;
