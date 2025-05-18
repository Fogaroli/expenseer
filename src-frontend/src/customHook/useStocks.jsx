import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { selectToken } from "../store/authSlice";
import ExpenseerAPI from "../helper/api";

/** useStocks  custom hook
 *
 * Hook created to handle backend interface and storage for Stocks information
 */
const useStocks = () => {
  const [stocksData, setStocksData] = useState(null);
  const [searchResults, setSeachResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = useSelector(selectToken);

  // Function to get list of stocks registered to the user
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

  // Remove stock from the user's list
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

  // Add new Stock to the user's list
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

  // Function to search for stocks based on the given term
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

  // Function to clear search results
  const clearResults = () => {
    setSeachResults(null);
  };

  // Triggers reading user's stock lists upon load
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

export default useStocks;
