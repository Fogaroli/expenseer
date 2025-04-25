import { useParams, Link } from "react-router-dom";

const Budget = () => {
  const { budgetName } = useParams();
  return (
    <div>
      <h1> {budgetName}</h1>
      <p>This is placeholder page.</p>
      <p>
        It should display a dashboard for the given budget and the last expenses
        reported
      </p>

      <Link to="/budgets">Go Back</Link>
      <Link to="/">See All</Link>
    </div>
  );
};

export default Budget;
