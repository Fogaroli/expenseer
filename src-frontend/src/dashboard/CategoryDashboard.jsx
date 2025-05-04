import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectToken } from "../store/authSlice";
import ExpenseerAPI from "../helper/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

const CategoryDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = useSelector(selectToken);

  useEffect(() => {
    const getCategoryDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        ExpenseerAPI.token = token;
        const response = await ExpenseerAPI.getExpenseDashboard("category");
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
    getCategoryDashboardData();
  }, [token]);

  return (
    <>
      <p>Expenses by Category</p>
      {loading && (
        <p>
          <FontAwesomeIcon icon={faCircleNotch} spin />
        </p>
      )}
      {error && <p className="text-danger">{error}</p>}
      {dashboardData &&
        dashboardData.map((category, idx) => {
          return (
            <div key={idx}>
              <Link to={`/categories/${category.category}`}>
                {category.category}
              </Link>{" "}
              - {category.total_amount}
            </div>
          );
        })}
    </>
  );
};

export default CategoryDashboard;
