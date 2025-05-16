import { useState, useEffect, useCallback } from "react";
import ExpenseerAPI from "../helper/api";
import { useSelector } from "react-redux";
import { selectToken } from "../store/authSlice";

/** useDashboard custom hook
 *
 * React Hook created to centralize the functions to collect budget and category dashboards
 *
 */
const useDashboard = (target = {}) => {
  const [currentMonth, setCurrentMonth] = useState({});
  const [history, setHistory] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = useSelector(selectToken);

  // Function to get dashboard data.
  // item variable defines if category or budget
  const getDashboard = useCallback(async () => {
    if (!token || Object.keys(target).length === 0) {
      setError("Target or token missing");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      ExpenseerAPI.token = token;
      let type, item;
      if ("category" in target) {
        type = "category";
        item = target.category;
      } else if ("budget" in target) {
        type = "budget";
        item = target.budget;
      } else {
        setError("Invalid target");
        return;
      }
      const response = await ExpenseerAPI.getDashboard(type, item);
      if (!response) throw new Error("Error retrieving dashboard");
      setCurrentMonth(response.current_month);
      setHistory(response.history);

      const expensesData = await ExpenseerAPI.getExpensesSummary(type, item);
      if (!expensesData) throw new Error("Error retrieving expenses");
      setExpenses(expensesData);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [token, target.category, target.budget]);

  // Trigger dashboard data update on startup
  useEffect(() => {
    getDashboard();
  }, [getDashboard]);

  return {
    currentMonth,
    history,
    expenses,
    isLoading,
    error,
    refresh: getDashboard,
  };
};

export default useDashboard;
