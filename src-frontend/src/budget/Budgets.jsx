import { useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getBudgets,
  selectBudgets,
  selectBudgetLoading,
  selectBudgetError,
} from "../store/budgetSlice";
import { selectToken } from "../store/authSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

const Budgets = () => {
  const dispatch = useDispatch();
  const budgets = useSelector(selectBudgets);
  const loading = useSelector(selectBudgetLoading);
  const error = useSelector(selectBudgetError);
  const token = useSelector(selectToken);

  useEffect(() => {
    if (token && budgets.length === 0) {
      dispatch(getBudgets(token));
    }
  }, [token, budgets.length, dispatch]);

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <h1>Budgets</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {budgets.map((budget, idx) => (
          <li key={idx}>
            <span>Icon{budget.type}</span>
            <Link to={`/budgets/${budget.name}`}>{budget.name}</Link>
            <span> - ${budget.amount}</span>
            <Link to={`/budgets/${budget.name}/edit`}>
              <FontAwesomeIcon icon={faPenToSquare} />
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/add-budget">Create Budget</Link>
    </>
  );
};

export default Budgets;
