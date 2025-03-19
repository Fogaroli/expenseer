const { sqlForPartialUpdate } = require("./partialUpdate");

describe("test helper function sqlForPartialUpdate", function () {
  test("works", function () {
    const { query, values } = sqlForPartialUpdate(
        "users",
        { first_name: "Test User", age: 40 },
        "username",
        "tuser"
    );
    expect(query).toEqual(`UPDATE users SET first_name=$1, age=$2 WHERE username=$3 RETURNING *`);
    expect(values).toEqual(["Test User", 40, "tuser"]);
  });

  test("works with empty data", function () {
    try {
      sqlForPartialUpdate("users", {}, "username", "tuser");
      fail();
    } catch (err) {
      expect(err.message).toEqual("No data");
    }
  });
});
