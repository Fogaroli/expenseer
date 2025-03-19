const jwt = require("jsonwebtoken");
const { createToken } = require("./tokens");
const { SECRET_KEY } = require("../config");

describe("test helper function createToken", function () {
  test("works username tuser", function () {
    const token = createToken({ username: "tuser", other_param: "anything" });
    const payload = jwt.verify(token, SECRET_KEY);
    expect(payload).toEqual({
      iat: expect.any(Number),
      username: "tuser",
      is_admin: false
    });
  });

  test("works admin username tuser", function () {
    const token = createToken({ username: "tuser", other_param: "anything", is_admin: true });
    const payload = jwt.verify(token, SECRET_KEY);
    expect(payload).toEqual({
      iat: expect.any(Number),
      username: "tuser",
      is_admin: true
    });
  });
});
