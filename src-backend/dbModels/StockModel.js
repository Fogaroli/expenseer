const db = require("../db.js");
const ExpressError = require("../helpers/expressError.js");
const { getStockPrice, stockSearch } = require("../helpers/api.js");

class Stock {
  /** Updates the current stock value for a given stock symbol
   *
   * This function is triggered when the stock value stored in the database is too old,
   * or when the stock is added to the database for the first time.
   *
   * Should collect the latest stock value from the API and update the database.
   *
   *  Returns the updated stock value and change status.
   */

  static async updateStock(stock) {
    const lastUpdate = new Date(stock.last_update);
    const now = new Date();
    if (now - lastUpdate > 60 * 60 * 1000) {
      console.log("Updating Stock rate for", stock.symbol);
      try {
        const stockData = await getStockPrice(stock.symbol);
        const newValue = stockData["Global Quote"]["05. price"];
        const variation = parseFloat(
          stockData["Global Quote"]["10. change percent"]
        );
        const lastUpdate = new Date();
        console.log(
          "Sending to Database",
          stock.symbol,
          newValue,
          variation,
          lastUpdate
        );
        const result = await db.query(
          `UPDATE stocks 
            SET value = $1, variation = $2, last_update = $3
            WHERE symbol = $4
            RETURNING symbol, value, variation, last_update`,
          [newValue, variation, lastUpdate, stock.symbol]
        );
        return result.rows[0];
      } catch (err) {
        console.log("Error updating stock in the database", err);
        throw new ExpressError("Error updating stock in the database", 500);
      }
    } else {
      console.log("Stock value is up to date for", stock.symbol);
      return {
        symbol: stock.symbol,
        value: stock.value,
        variation: stock.variation,
        last_update: stock.last_update,
      };
    }
  }

  /** Creates the database entry for the stock information for a given symbol
   *
   * This function is triggered when the stock information is not found in the database.
   *
   * Should trigger the update function to fetch the latest value and variation from the API.
   *
   * Returns the recently created stock information.
   */

  static async createStock(symbol) {
    console.log("Adding stock info in the database for", symbol);
    let value = 0;
    let timestamp = `2020-01-01T00:00:00`;
    //Read the exchange rate first to make sure it is valid before saving to the database
    try {
      const stockData = await getStockPrice(symbol);
      value = stockData["Global Quote"]["05. price"];
      const variation = parseFloat(
        stockData["Global Quote"]["10. change percent"]
      );
      timestamp = new Date();
      const result = await db.query(
        `INSERT INTO stocks 
          (symbol, value, variation, last_update)
          VALUES ($1, $2, $3, $4)
          RETURNING symbol, value, variation, last_update`,
        [symbol, value, variation, timestamp]
      );
      const newStock = result.rows[0];
      return newStock;
    } catch (err) {
      console.log("Error creating stock in the database", err);
      throw new ExpressError("Error creating stock", 500);
    }
  }

  /** Check if the stock info for a given symbol already exists in the database
   *
   * returns the stock detail if it exists, otherwise returns null
   *
   */
  static async checkStock(symbol) {
    const result = await db.query(
      `SELECT *
         FROM stocks
         WHERE symbol = $1`,
      [symbol]
    );
    return result.rows[0];
  }

  /** Returns list of stocks for a provided username:
   *
   * returns: [{symbol, value, variation, last_updates}, ...]
   *
   * */
  static async getAll(username) {
    const result = await db.query(
      `SELECT s.symbol, s.value, s.variation, s.last_update
            FROM stocks AS s
            RIGHT JOIN user_stock AS us ON us.stock_ref = s.symbol
            WHERE us.username = $1 
            ORDER BY s.symbol`,
      [username]
    );
    const stocks = result.rows;
    if (stocks.length === 0) {
      return stocks;
    }
    const returnStocks = await Promise.all(
      stocks.map(async (stock) => {
        const updatedStock = await this.updateStock(stock);
        return updatedStock;
      })
    );
    return returnStocks;
  }

  /** Returns the stock value and daily variation for a given stock symbol
   *  If the value is already in the database and not older than 1 hour,
   * it should return the rate from the database. Otherwise, it should create the stock entry
   * in the database and fetch the latest value from the API.
   *
   * return: {symbol, value, variation, last_update}
   *
   *
   **/
  static async get(symbol) {
    const readStock = await this.checkStock(symbol);
    if (readStock) {
      const updatedValue = await this.updateStock(readStock);
      return updatedValue;
    }
    const newStock = await this.createStock(symbol);
    return newStock;
  }

  /** Add stock to user list.
   *
   * Returns the stock data
   *
   * */
  static async addToUser(username, { symbol }) {
    const duplicateCheck = await db.query(
      `SELECT s.symbol 
            FROM stocks AS s
            RIGHT JOIN user_stock AS us ON us.stock_ref = s.symbol 
            WHERE us.username = $1 AND s.symbol = $2`,
      [username, symbol]
    );
    console.assert(
      !duplicateCheck.rows[0],
      "Stock already assigned to this user"
    );
    if (duplicateCheck.rows[0]) {
      throw new ExpressError(`User already have this stock assigned`, 400);
    }

    let readStock = await this.checkStock(symbol);
    if (!readStock) {
      await this.createStock(symbol);
      readStock = await this.checkStock(symbol);
    }
    try {
      await db.query(
        `INSERT INTO user_stock (username, stock_ref)
            VALUES ($1, $2)
            RETURNING username`,
        [username, readStock.symbol]
      );
      const updatedStock = await this.updateStock(readStock);
      return updatedStock;
    } catch (err) {
      console.log("Error adding stock to user", err);
      throw new ExpressError("Error adding stock to user", 500);
    }
  }

  /** Delete stock from user.
   *
   * If stock assignment cannot be found for given username, should raise a 404.
   *
   **/

  static async delete(username, { symbol }) {
    const readStock = await this.checkStock(symbol);
    if (!readStock) {
      throw new ExpressError("No such stock", 404);
    }
    const result = await db.query(
      `DELETE FROM user_stock
            WHERE username = $1 AND stock_ref = $2
            RETURNING username`,
      [username, symbol]
    );
    const deletedRate = result.rows[0];
    if (!deletedRate) {
      throw new ExpressError("Stock not in the user list", 404);
    }
    return { symbol };
  }

  /** Search for stock symbols using a search term
   *
   * Returns a list of stock symbols and names that match the search term.
   *
   * */
  static async search(term) {
    try {
      const result = await stockSearch(term);
      const stocks = result["bestMatches"];
      if (stocks.length === 0) {
        return [];
      }
      const returnStocks = stocks.map((stock) => {
        return { symbol: stock["1. symbol"], name: stock["2. name"] };
      });
      return returnStocks;
    } catch (err) {
      console.log("Error searching for stocks", err);
      throw new ExpressError("Error searching for stocks", 500);
    }
  }
}

module.exports = Stock;
