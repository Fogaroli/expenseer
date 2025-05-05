const db = require("../db");
const ExpressError = require("../helpers/expressError");
const { sqlForPartialUpdate } = require("../helpers/partialUpdate.js");

class Category {
  /** Create a new category.
   *
   * [{name}]
   *
   * Returns new category data.
   *
   * */
  static async create(username, category) {
    const duplicateCheck = await db.query(
      `SELECT name 
            FROM categories 
            WHERE username = $1 AND name = $2`,
      [username, category.name]
    );
    console.assert(
      !duplicateCheck.rows[0],
      "Attempt to create already existing category"
    );

    if (duplicateCheck.rows[0]) {
      throw new ExpressError(
        `User already have a category with this name`,
        400
      );
    }

    const result = await db.query(
      `INSERT INTO categories (name, username)
            VALUES ($1, $2)
            RETURNING name`,
      [category.name, username]
    );
    const newCategory = result.rows[0];
    return newCategory;
  }

  /** Returns list of categories for a provided username:
   *
   * [{name}, ...]
   *
   * */
  static async getAll(username) {
    const result = await db.query(
      `SELECT name
            FROM categories
            WHERE username = $1 
            ORDER BY name`,
      [username]
    );
    return result.rows;
  }

  /** Returns category info for given category and username
   *  NOTE This route has low value right now, but could expand in case more
   * data is added to category.
   *
   * return: {name}
   *
   * If category cannot be found, should raise a 404.
   *
   **/

  static async get(username, categoryName) {
    const result = await db.query(
      `SELECT name
         FROM categories
         WHERE username = $1 AND name = $2`,
      [username, categoryName]
    );

    const readCategory = result.rows[0];

    if (!readCategory) {
      throw new ExpressError("No such category", 404);
    }

    return readCategory;
  }

  /** Selectively updates category from given data
   *
   * If the target category does not exist to given user, should raise a 404.
   *
   * Returns the data for the category after update.
   *
   *
   **/

  static async update(username, categoryName, data) {
    const duplicateCheck = await db.query(
      `SELECT name 
            FROM categories 
            WHERE username = $1 AND name = $2`,
      [username, data.name]
    );
    console.assert(
      !duplicateCheck.rows[0],
      "Attempt to create already existing category"
    );

    if (duplicateCheck.rows[0]) {
      throw new ExpressError(
        `User already have a category with this name`,
        400
      );
    }

    const result = await db.query(
      `SELECT name
         FROM categories
         WHERE username = $1 AND name = $2`,
      [username, categoryName]
    );
    if (result.rows.length === 0) {
      throw new ExpressError("No such category", 404);
    }

    let { query, values } = sqlForPartialUpdate(
      "categories",
      data,
      "name",
      categoryName
    );
    const updated = await db.query(query, values);
    const readCategory = updated.rows[0];
    delete readCategory.id;
    delete readCategory.username;
    return readCategory;
  }

  /** Delete category by name. Returns true.
   *
   * If category cannot be found for given username, should raise a 404.
   *
   **/

  static async delete(username, categoryName) {
    const result = await db.query(
      "DELETE FROM categories WHERE username = $1 AND name = $2 RETURNING name",
      [username, categoryName]
    );
    const deletedCategory = result.rows[0];

    if (!deletedCategory) {
      throw new ExpressError("No such category", 404);
    }
    return true;
  }
}

module.exports = Category;
