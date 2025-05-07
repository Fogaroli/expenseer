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
      if (!response) {
        throw new Error("Error retrieving stocks");
      }
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
      const response = await ExpenseerAPI.deleteStock(symbol);
      if (!response) {
        throw new Error("Error deleting stock");
      }
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
      const response = await ExpenseerAPI.addStock(symbol);
      if (!response) {
        throw new Error("Error adding stock");
      }
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
      if (!response) {
        throw new Error("Error during search");
      }
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
