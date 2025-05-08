import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectToken } from "../store/authSlice";
import BudgetDashboard from "./BudgetsDashboard";
import CategoryDashboard from "./CategoryDashboard";

const dashboards = [<BudgetDashboard />, <CategoryDashboard />];

/** Dashboard component
 * Should provide access to dashboards for categories or budgets in a carousel
 */
const Dashboards = () => {
  const [showing, setShowing] = useState(0);
  const navigate = useNavigate();
  const token = useSelector(selectToken);

  const prev = () =>
    setShowing((c) => (c === 0 ? dashboards.length - 1 : c - 1));
  const next = () =>
    setShowing((c) => (c === dashboards.length - 1 ? 0 : c + 1));

  if (!token) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <p>Dasboards</p>
      <div style={{ textAlign: "center" }}>
        <button onClick={prev}>&lt;</button>
        <span style={{ margin: "0 2rem" }}>{dashboards[showing]}</span>
        <button onClick={next}>&gt;</button>
      </div>
      <button
        type="button"
        onClick={() => {
          navigate("/add-expense");
        }}
      >
        Add new Expense
      </button>
    </>
  );
};

export default Dashboards;
