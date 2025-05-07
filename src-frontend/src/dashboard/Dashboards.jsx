import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BudgetDashboard from "./BudgetsDashboard";
import CategoryDashboard from "./CategoryDashboard";

const dashboards = [<BudgetDashboard />, <CategoryDashboard />];

const Dashboards = () => {
  const [showing, setShowing] = useState(0);
  const navigate = useNavigate();

  const prev = () =>
    setShowing((c) => (c === 0 ? dashboards.length - 1 : c - 1));
  const next = () =>
    setShowing((c) => (c === dashboards.length - 1 ? 0 : c + 1));

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
