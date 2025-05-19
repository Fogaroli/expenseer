const db = require("../db.js");
const ExpressError = require("../helpers/expressError.js");
const { getExchangeRate } = require("../helpers/api.js");

class Exchange {
  /** Updates the exchange rate for a given currency pair
   *
   * This function is triggered when the exchange rate stored in teh database is too old,
   * or when the exchange rate pair is created fro teh first time.
   *
   * Should collect the latest exchange rate from the API and update the database.
   *
   *  Returns the updated exchange rate.
   */

  static async updateRate(rate) {
    const lastUpdate = new Date(rate.last_update);
    const now = new Date();
    if (now - lastUpdate > 24 * 60 * 60 * 1000) {
      console.log("Updating exchange rate for", rate.currency1, rate.currency2);
      const exchangeData = await getExchangeRate(
        rate.currency1,
        rate.currency2
      );
      const newRate = exchangeData.conversion_rate;
      const lastUpdate = exchangeData.time_last_update_utc;
      const result = await db.query(
        `UPDATE exchanges 
          SET rate = $1, last_update = $2
          WHERE id = $3
          RETURNING currency1, currency2, rate, last_update`,
        [newRate, lastUpdate, rate.id]
      );
      return result.rows[0];
    } else {
      console.log(
        "Exchange rate is up to date for",
        rate.currency1,
        rate.currency2
      );
      return {
        currency1: rate.currency1,
        currency2: rate.currency2,
        rate: rate.rate,
        last_update: rate.last_update,
      };
    }
  }

  /** Creates the database entry for the exchange rate for a given currency pair
   *
   * This function is triggered when the exchange rate is not found in the database.
   *
   * Should trigger the update function to fetch the latest exchange rate from the API.
   *
   * Returns the recently created exchange rate.
   */

  static async createRate({ currency1, currency2 }) {
    console.log(
      "Adding exchange rate in the database for",
      currency1,
      currency2
    );
    let rate = 0;
    let timestamp = `2020-01-01T00:00:00`;
    //Read the exchange rate first to make sure it is valid before saving to the database
    try {
      const exchangeData = await getExchangeRate(currency1, currency2);
      rate = exchangeData.conversion_rate;
      timestamp = exchangeData.time_last_update_utc;
    } catch (err) {
      throw new ExpressError("Error getting exchange rate", 500);
    }
    try {
      const result = await db.query(
        `INSERT INTO exchanges 
          (currency1, currency2, rate, last_update)
          VALUES ($1, $2, $3, $4)
          RETURNING currency1, currency2, rate, last_update`,
        [currency1, currency2, rate, timestamp]
      );
      const newRate = result.rows[0];
      return newRate;
    } catch (err) {
      console.log("Error creating exchange rate in the database", err);
      throw new ExpressError("Error getting exchange rate", 500);
    }
  }

  /** Returns list of exchanges for a provided username:
   *
   * [{currency1, currency2, rate, last_update}, ...]
   *
   * */
  static async getAll(username) {
    const result = await db.query(
      `SELECT e.id, e.currency1, e.currency2, e.rate, e.last_update
            FROM exchanges AS e
            RIGHT JOIN user_exchange AS ue ON ue.exchange_id = e.id 
            WHERE ue.username = $1 
            ORDER BY e.currency1`,
      [username]
    );
    const rates = result.rows;
    if (rates.length === 0) {
      return rates;
    }
    const returnRates = await Promise.all(
      rates.map(async (rate) => {
        const updatedRate = await this.updateRate(rate);
        return updatedRate;
      })
    );
    return returnRates;
  }

  /** Check if the exchange rate for a given currency pair already exists in the database
   *
   * returns the exchange rate if it exists, otherwise returns null
   *
   */
  static async checkRate({ currency1, currency2 }) {
    const result = await db.query(
      `SELECT *
         FROM exchanges
         WHERE currency1 = $1 AND currency2 = $2`,
      [currency1, currency2]
    );
    return result.rows[0];
  }

  /** Returns the exchange rate for a given currency pair
   *  If the exchange rate is already in the database and not older than 24 hours,
   * it should return the rate from the database. Otherwise, it should create the exchange rate
   * in the database and fetch the latest rate from the API.
   *
   * return: {currency1, currency2, rate, last_update}
   *
   *
   **/
  static async get({ currency1, currency2 }) {
    const readRate = await this.checkRate({ currency1, currency2 });
    if (readRate) {
      const updatedRate = await this.updateRate(readRate);
      return updatedRate;
    }
    const newRate = await this.createRate({ currency1, currency2 });
    return newRate;
  }

  /** Add exchange rate to user list.
   *
   * Returns the currency pair data
   *
   * */
  static async addToUser(username, { currency1, currency2 }) {
    const duplicateCheck = await db.query(
      `SELECT e.id, e.currency1, e.currency2, e.rate, e.last_update
            FROM exchanges AS e
            RIGHT JOIN user_exchange AS ue ON ue.exchange_id = e.id 
            WHERE ue.username = $1 AND e.currency1 = $2 AND e.currency2 = $3`,
      [username, currency1, currency2]
    );

    if (duplicateCheck.rows[0]) {
      throw new ExpressError(
        `User already have this currency pair assigned`,
        400
      );
    }

    let readRate = await this.checkRate({ currency1, currency2 });
    if (!readRate) {
      await this.createRate({ currency1, currency2 });
      readRate = await this.checkRate({ currency1, currency2 });
    }
    try {
      await db.query(
        `INSERT INTO user_exchange (username, exchange_id)
            VALUES ($1, $2)
            RETURNING username`,
        [username, readRate.id]
      );
      const updatedRate = await this.updateRate(readRate);
      return updatedRate;
    } catch (err) {
      console.log("Error adding exchange rate to user", err);
      throw new ExpressError("Error adding exchange rate to user", 500);
    }
  }

  /** Delete currency pair from user.
   *
   * If pair assignment cannot be found for given username, should raise a 404.
   *
   **/

  static async delete(username, { currency1, currency2 }) {
    const readRate = await this.checkRate({ currency1, currency2 });
    if (!readRate) {
      throw new ExpressError("No such exchange rate", 404);
    }
    const result = await db.query(
      `DELETE FROM user_exchange
            WHERE username = $1 AND exchange_id = $2
            RETURNING username`,
      [username, readRate.id]
    );
    const deletedRate = result.rows[0];
    if (!deletedRate) {
      throw new ExpressError("Exchange rate not in the user list", 404);
    }
    return { currency1, currency2 };
  }
}

module.exports = Exchange;
