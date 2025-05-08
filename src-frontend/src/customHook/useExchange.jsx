import { useState, useEffect, useCallback } from "react";
import ExpenseerAPI from "../helper/api";
import { useSelector } from "react-redux";
import { selectToken } from "../store/authSlice";

/** useExchange custom hook
 *
 * Hook created to handle backend interface and storage of exchange rate information
 */
const useExchange = () => {
  const [exchangeData, setExchangeData] = useState(null);
  const [instantRate, setInstanteRate] = useState(null);
  const [availableCurrency, setAvailableCurrency] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = useSelector(selectToken);

  // Function to get all currency exchange relations pinned by the user
  const getExchanges = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      ExpenseerAPI.token = token;
      const response = await ExpenseerAPI.getExchanges();
      if (!response) {
        throw new Error("Error retrieving exchange rates");
      }
      setExchangeData(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Function to read a single exchange rate.
  const getExchange = async (currency1, currency2) => {
    setLoading(true);
    setError(null);
    try {
      ExpenseerAPI.token = token;
      const response = await ExpenseerAPI.getExchange(currency1, currency2);
      if (!response) {
        throw new Error("Error retrieving exchange rates");
      }
      setInstanteRate(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to delete exchange rate relation from the user's list
  const deleteExchange = async (currency1, currency2) => {
    setLoading(true);
    setError(null);
    try {
      ExpenseerAPI.token = token;
      await ExpenseerAPI.deleteExchange(currency1, currency2);
      getExchanges();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to add new exchange rate to the
  const addExchange = async (currency1, currency2) => {
    setLoading(true);
    setError(null);
    try {
      ExpenseerAPI.token = token;
      await ExpenseerAPI.addExchange(currency1, currency2);
      setInstanteRate(null);
      getExchanges();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Triggers collecting exchange rates
  useEffect(() => {
    getExchanges();
  }, [getExchanges]);

  // Load list of supported currency codes on startup
  useEffect(() => {
    //
    const getCodes = async () => {
      try {
        ExpenseerAPI.token = token;
        const response = await ExpenseerAPI.getCurrencyCodes();
        if (!response) throw new Error("Error getting currency codes");
        const codes = response.map((code) => code[0]);
        setAvailableCurrency(codes);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getCodes();
  }, [token]);

  return {
    exchangeData,
    availableCurrency,
    instantRate,
    loading,
    error,
    addExchange,
    deleteExchange,
    getExchange,
    refresh: getExchanges,
  };
};

export default useExchange;
