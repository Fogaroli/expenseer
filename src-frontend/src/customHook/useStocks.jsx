import { useState, useEffect, useCallback } from "react";
import ExpenseerAPI from "../helper/api";
import { useSelector } from "react-redux";
import { selectToken } from "../store/authSlice";

const useStocks = () => {
  const [stocksData, setStocksData] = useState(null);
  const [searchResults, setSeachResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = useSelector(selectToken);

  const getStocks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      ExpenseerAPI.token = token;
      const response = await ExpenseerAPI.getStocks();
      setStocksData(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const deleteStock = async (symbol) => {
    setLoading(true);
    setError(null);
    try {
      ExpenseerAPI.token = token;
      await ExpenseerAPI.deleteStock(symbol);
      getStocks();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addStock = async (symbol) => {
    setLoading(true);
    setError(null);
    try {
      ExpenseerAPI.token = token;
      await ExpenseerAPI.addStock(symbol);
      getStocks();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchStocks = async (term) => {
    setLoading(true);
    setError(null);
    try {
      ExpenseerAPI.token = token;
      const response = await ExpenseerAPI.searchStocks(term);
      setSeachResults(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setSeachResults(null);
  };

  useEffect(() => {
    getStocks();
  }, [getStocks]);

  return {
    stocksData,
    searchResults,
    loading,
    error,
    addStock,
    deleteStock,
    searchStocks,
    clearResults,
    refresh: getStocks,
  };
};

export { useStocks };
