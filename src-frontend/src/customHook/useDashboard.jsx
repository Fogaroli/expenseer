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
  const [targetData, setTargetData] = useState(null);
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
      let dashboardType, item;
      if ("category" in target) {
        dashboardType = "category";
        item = target.category;
      } else if ("budget" in target) {
        dashboardType = "budget";
        item = target.budget;
      } else {
        setError("Invalid target");
        return;
      }
      const response = await ExpenseerAPI.getDashboard(dashboardType, item);
      if (!response) throw new Error("Error retrieving dashboard");
      setTargetData({
        item: response[dashboardType],
        type: response.type || 0,
        amount: response.amount || 0,
      });
      setCurrentMonth(response.current_month);
      const historyData = response.history.reverse() || [];
      setHistory(historyData);

      const expensesData = await ExpenseerAPI.getExpensesSummary(
        dashboardType,
        item
      );
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
    targetData,
    currentMonth,
    history,
    expenses,
    isLoading,
    error,
    refresh: getDashboard,
  };
};

export default useDashboard;
