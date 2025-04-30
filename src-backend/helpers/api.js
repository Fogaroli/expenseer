const { API_KEY, STOCK_API_KEY } = require("../config.js");
const axios = require("axios");

/**
 * Fetches the exchange rate between two currencies.
 * Using ExchangeRate API
 *
 * Currency1 and currency2 are the two currencies to convert.
 * Format should be 3 letter currency code (e.g. USD, EUR, GBP)
 * The function returns the exchange rate between the two currencies.
 */
const getExchangeRate = async (currency1, currency2) => {
  try {
    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${currency1}/${currency2}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Unable to fetch exchange rate");
  }
};

/**
 * Fetches the stock price for a given stock symbol.
 * Using Alpha Vantage API
 *
 * Symbol should be a valid stock symbol (e.g. AAPL, MSFT, GOOGL)
 * The function returns the stock price and daily variation for the given symbol.
 *
 */
const getStockPrice = async (symbol) => {
  try {
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${STOCK_API_KEY}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Unable to fetch stock price");
  }
};

/**
 * Fetches the stock search results for a given search term.
 * Using Alpha Vantage API
 *
 * Term should be a string to search for stock symbols.
 *
 */
const stockSearch = async (term) => {
  try {
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${term}&apikey=${STOCK_API_KEY}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Unable to fetch stock search results");
  }
};

module.exports = {
  getExchangeRate,
  getStockPrice,
  stockSearch,
};
