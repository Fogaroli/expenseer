import { useParams, Link, useNavigate } from "react-router-dom";
import { useDashboard } from "../customHook/useDashboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

const Category = () => {
  const { categoryName } = useParams();
  const [currentMonth, history, expenses, isLoading, error] = useDashboard({
    category: categoryName,
  });
  const navigate = useNavigate();

  const handleAddExpense = () => {
    navigate("/add-expense", {
      state: {
        filters: { category: categoryName },
      },
    });
  };

  return (
    <div>
      <h1> {categoryName}</h1>
      {isLoading && (
        <p>
          <FontAwesomeIcon icon={faCircleNotch} spin />
        </p>
      )}
      {error && <p className="text-danger">{error}</p>}
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
            {exp.amount} - {exp.budget_name}
          </div>
        );
      })}
      <button type="button" onClick={handleAddExpense}>
        Add new Expense
      </button>
      <Link to="/categories">Go Back</Link>
      <Link to="/">See All</Link>
    </div>
  );
};

export default Category;
