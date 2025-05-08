import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectToken } from "../store/authSlice";
import useDashboard from "../customHook/useDashboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

/** Category component
 *
 * Show a dashboard for the category
 * Should show expenses for current month, history of the last 6 months and the last
 * expenses registered to this category
 */
const Category = () => {
  const { categoryName } = useParams();
  const token = useSelector(selectToken);
  const { currentMonth, history, expenses, isLoading, error } = useDashboard({
    category: categoryName,
  });
  const navigate = useNavigate();

  // Process click to the button to add expense
  // Should send the category name as filter to the add expense component
  const handleAddExpense = () => {
    navigate("/add-expense", {
      state: {
        filters: { category: categoryName },
      },
    });
  };

  // Process clicks to the see all link
  // Should redirect to the expenses components with filters pre-defined
  const handleSeeAll = () => {
    navigate("/expenses", {
      state: {
        filters: { category: categoryName },
      },
    });
  };

  if (!token) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <h1> {categoryName}</h1>
      {isLoading && (
        <p>
          <FontAwesomeIcon icon={faCircleNotch} spin />
        </p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>Status</p>
      {currentMonth?.month || ""} - {currentMonth?.total_amount || ""}
      <p>History</p>
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
            {exp.amount} - {exp.budget}
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

export default Category;
