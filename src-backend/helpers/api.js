const { API_KEY } = require("../config.js");
const axios = require("axios");

const getExchangeRate = async (currency1, currency2) => {
  try {
    const response = await axios.get(`https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${currency1}/${currency2}`);
    return response.data;
  } catch (error) {
    throw new Error("Unable to fetch exchange rate");
  }
}

module.exports = {
    getExchangeRate
    };
