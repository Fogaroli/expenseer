const bcrypt = require("bcrypt");
const db = require("../db");
const ExpressError = require("../helpers/expressError");
const { sqlForPartialUpdate}  = require("../helpers/partialUpdate.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

const DEFAULT_IMAGE_URL =
  "https://images.freeimages.com/fic/images/icons/989/ivista_2/256/user.png";

class User {
  /** Register user with data. Returns new user data. */

  static async register({
    username,
    password,
    first_name,
    last_name,
    email,
    image_url
  }) {
    const duplicateCheck = await db.query(
      `SELECT username 
        FROM users 
        WHERE username = $1`,
      [username]
    );
    console.assert(duplicateCheck.rows[0], "Attempt to register already existing username");

    if (duplicateCheck.rows[0]) {
      throw new ExpressError(
        `There already exists a user with username '${username}'`,
        400
      );
    }
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users 
          (username, password, first_name, last_name, email, image_url, last_logged) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) 
        RETURNING username, password, first_name, last_name, email, image_url, last_logged`,
      [
        username,
        hashedPassword,
        first_name,
        last_name,
        email,
        image_url || DEFAULT_IMAGE_URL,
        new Date(),
      ]
    );

    return result.rows[0];
  }

  /** Is this username + password combo correct?
   *
   * Return all user data if true, throws error if invalid
   *
   * */

  static async authenticate(username, password) {
    const result = await db.query(
      `SELECT username,
                password,
                first_name,
                last_name,
                email,
                image_url,
                last_logged
            FROM users 
            WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];

    if (user && (await bcrypt.compare(password, user.password))) {
      await db.query(
        `UPDATE users
          SET last_logged = $1
          WHERE username = $2`,
        [new Date(), username]
      );
      return {username:user.username, first_name:user.first_name, last_name: user.last_name, last_logged: user.last_logged};
    } else {
      throw new ExpressError("Cannot authenticate", 401);
    }
  }

  /** Returns list of user info:
   *
   * [{username, first_name, last_name}, ...]
   *
   * */

  static async getAll() {

    const result = await db.query(
      `SELECT username,
                first_name,
                last_name
            FROM users 
            ORDER BY username`
    );
    return result.rows;
  }

  /** Returns user info for given username
   * 
   * return: {username, first_name, last_name, email, image_url, last_logged}
   * If user is admin, add is_admin: true to the return object.
   *
   * If user cannot be found, should raise a 404.
   *
   **/

  static async get(username) {
    const result = await db.query(
      `SELECT username,
                first_name,
                last_name,
                email,
                image_url,
                last_logged,
                is_admin
         FROM users
         WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];

    if (!user) {
      throw new ExpressError("No such user", 404);
    }

    const { is_admin, ...returnData } = user;
    return user.is_admin ? user : returnData;
  }

  /** Selectively updates user from given data
   *
   * Returns all data about user.
   *
   * If user cannot be found, should raise a 404.
   *
   **/

  static async update(username, data) {
    let { query, values } = sqlForPartialUpdate(
      "users",
      data,
      "username",
      username
    );
 
    const result = await db.query(query, values);
    const user = result.rows[0];

    if (!user) {
      throw new ExpressError("No such user", 404);
    }

    const { password, ...userWithoutPassword } = user;
    const { is_admin, ...returnData } = userWithoutPassword;
    return user.is_admin ? userWithoutPassword : returnData;

  }

  /** Delete user for given username. Returns true.
   *
   * If user cannot be found, should raise a 404.
   *
   **/

  static async delete(username) {
    const result = await db.query(
      "DELETE FROM users WHERE username = $1 RETURNING username",
      [username]
    );
    const user = result.rows[0];

    if (!user) {
      throw new ExpressError("No such user", 404);
    }
    return true;
  }
}

module.exports = User;
