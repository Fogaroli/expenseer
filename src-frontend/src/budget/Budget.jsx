import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectToken } from "../store/authSlice";
import useDashboard from "../customHook/useDashboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

/** Budget component
 *
 * Show a dashboard for the budget
 * Should show expenses for current month, history of the last 6 months and the last
 * expenses registered to this budget
 */
const Budget = () => {
  const { budgetName } = useParams();
  const token = useSelector(selectToken);
  const { currentMonth, history, expenses, isLoading, error } = useDashboard({
    budget: budgetName,
  });
  const navigate = useNavigate();

  // Process click to the button to add expense
  // Should send the budget name as filter to the add expense component
  const handleAddExpense = () => {
    navigate("/add-expense", {
      state: {
        filters: { budget: budgetName },
      },
    });
  };

  // Process clicks to the see all link
  // Should redirect to the expenses components with filters pre-defined
  const handleSeeAll = () => {
    navigate("/expenses", {
      state: {
        filters: { budget: budgetName },
      },
    });
  };

  if (!token) {
    return <Navigate to="/" />;
  }
  return (
    <div>
      <h1> {budgetName}</h1>
      {isLoading && (
        <p>
          <FontAwesomeIcon icon={faCircleNotch} spin />
        </p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>Status</p>
      {currentMonth?.month || ""} - {currentMonth?.total_amount || ""} -{" "}
      {currentMonth?.percent_used || ""}%<p>History</p>
      {history.map((hist, idx) => {
        return (
          <div key={idx}>
            {hist.month} - {hist.total_amount}
          </div>
        );
      })}
      <p>Latest Expenses</p>
      {expenses.map((exp, idx) => {
        return (
          <div key={idx}>
            {new Date(exp.date).toISOString().split("T")[0]} - {exp.name} -{" "}
            {exp.amount} - {exp.category}
          </div>
        );
      })}
      <button type="button" onClick={() => window.history.back()}>
        Back
      </button>
      <button type="button" onClick={handleAddExpense}>
        Add new Expense
      </button>
      <button type="button" onClick={handleSeeAll}>
        See All
      </button>
    </div>
  );
};

export default Budget;
