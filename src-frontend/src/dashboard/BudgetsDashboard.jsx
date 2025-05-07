import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectToken } from "../store/authSlice";
import ExpenseerAPI from "../helper/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

const BudgetDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = useSelector(selectToken);

  useEffect(() => {
    const getBudgetDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        ExpenseerAPI.token = token;
        const response = await ExpenseerAPI.getExpenseDashboard("budget");
        if (!response) {
          throw new Error("Error retrieving dashboard");
        }
        setDashboardData(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getBudgetDashboardData();
  }, [token]);

  return (
    <>
      <p>Expenses by Budget</p>
      {loading && (
        <p>
          <FontAwesomeIcon icon={faCircleNotch} spin />
        </p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {dashboardData &&
        dashboardData.map((budget, idx) => {
          return (
            <div key={idx}>
              <Link to={`/budgets/${budget.budget}`}>{budget.budget}</Link> -{" "}
              {budget.total_amount} - {budget.budget_amount} -{" "}
              {budget.percentage_used}
            </div>
          );
        })}
    </>
  );
};

export default BudgetDashboard;
