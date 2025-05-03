import { useState, useEffect, use } from "react";
import ExpenseerAPI from "../helper/api";
import { useSelector } from "react-redux";
import { selectToken } from "../store/authSlice";

const useDashboard = (target = {}) => {
  const [currentMonth, setCurrentMonth] = useState({});
  const [history, setHistory] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = useSelector(selectToken);

  useEffect(() => {
    const fetchData = async (type, item) => {
      setIsLoading(true);
      setError(null);
      try {
        ExpenseerAPI.token = token;
        const response = await ExpenseerAPI.getDashboard(type, item);
        if (!response) {
          throw new Error("Error retrieving dashboard");
        }
        setCurrentMonth(response.current_month);
        setHistory(response.history);

        const expensesData = await ExpenseerAPI.getExpensesSummary(type, item);
        if (!expensesData) {
          throw new Error("Error retrieving expenses");
        }
        setExpenses(expensesData);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (Object.keys(target).includes("category")) {
      fetchData("category", target.category);
    }

    if (Object.keys(target).includes("budget")) {
      fetchData("budget", target.budget);
    }

    if (Object.keys(target).length === 0) {
      setError("Target is empty");
    }
  }, [token]);

  return [currentMonth, history, expenses, isLoading, error];
};

export { useDashboard };
