import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import {
  getBudgets,
  selectBudgets,
  selectBudgetLoading,
  selectBudgetError,
} from "../store/budgetSlice";
import { selectToken } from "../store/authSlice";
import {
  getCategories,
  selectCategories,
  selectCategoryError,
  selectCategoryLoading,
} from "../store/categorySlice";
import ExpenseerAPI from "../helper/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import ExpenseItem from "./ExpenseItem";

const LIMIT = 20;

const Espenses = () => {
  const INITIALFILTERS = {
    category: "",
    budget: "",
    startdate: "",
    enddate: "",
  };
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldsData, setFieldData] = useState(INITIALFILTERS);
  const categories = useSelector(selectCategories);
  const budgets = useSelector(selectBudgets);
  const categoryLoading = useSelector(selectCategoryLoading);
  const categoryError = useSelector(selectCategoryError);
  const budgetLoading = useSelector(selectBudgetLoading);
  const budgetError = useSelector(selectBudgetError);
  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  useEffect(() => {
    setExpenses([]);
    setOffset(0);
    setHasMore(true);
  }, [fieldsData, token]);

  useEffect(() => {
    const getExpenses = async (filters) => {
      setLoading(true);
      setError(null);
      try {
        ExpenseerAPI.token = token;
        const response = await ExpenseerAPI.getExpenses(filters);
        if (!response) {
          throw new Error("Error retrieving expenses");
        }
        setExpenses((prev) =>
          offset === 0 ? response : [...prev, ...response]
        );
        setHasMore(response.length === LIMIT);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    const filters = { limit: LIMIT, offset };
    fieldsData.category === ""
      ? null
      : (filters.category = fieldsData.category);
    fieldsData.budget === "" ? null : (filters.budget = fieldsData.budget);
    fieldsData.startdate === ""
      ? null
      : (filters.start_date = fieldsData.startdate);
    fieldsData.enddate === "" ? null : (filters.end_date = fieldsData.enddate);

    getExpenses(filters);
  }, [fieldsData, token, offset]);

  const lastExpenseRef = useCallback(
    (last) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new window.IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setOffset((prev) => prev + LIMIT);
        }
      });
      if (last) observer.current.observe(last);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    if (token && budgets.length === 0) {
      dispatch(getBudgets(token));
    }
    if (token && categories.length === 0) {
      dispatch(getCategories(token));
    }
  }, [token, budgets.length, categories.length, dispatch]);

  const handleChange = (evt) => {
    let { name, value } = evt.target;
    setFieldData((oldData) => ({
      ...oldData,
      [name]: value,
    }));
  };

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <h1>Expenses</h1>
      <h3>Filters</h3>
      <label htmlFor="category">by category</label>
      <select
        name="category"
        id="category"
        aria-describedby="Category"
        value={fieldsData.category}
        onChange={handleChange}
      >
        <option value="">Select Category</option>
        {categories.map((cat, idx) => (
          <option key={idx} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>
      {categoryLoading && (
        <p>
          <FontAwesomeIcon icon={faCircleNotch} spin />
        </p>
      )}
      {categoryError && <p className="text-danger">{categoryError}</p>}
      <label htmlFor="budget">by budget</label>
      <select
        name="budget"
        id="budget"
        aria-describedby="Budget"
        value={fieldsData.budget}
        onChange={handleChange}
      >
        <option value="">Select Budget</option>
        {budgets.map((bud, idx) => (
          <option key={idx} value={bud.name}>
            {bud.name}
          </option>
        ))}
      </select>
      {budgetLoading && (
        <p>
          <FontAwesomeIcon icon={faCircleNotch} spin />
        </p>
      )}
      {budgetError && <p className="text-danger">{budgetError}</p>}
      <label htmlFor="startdate">Start Date</label>
      <input
        type="date"
        name="startdate"
        id="startdate"
        aria-describedby="Start Date"
        value={fieldsData.start_date}
        onChange={handleChange}
      />
      <label htmlFor="enddate">End Date</label>
      <input
        type="date"
        name="enddate"
        id="enddate"
        aria-describedby="End Date"
        value={fieldsData.end_date}
        onChange={handleChange}
      />
      <button
        type="button"
        onClick={() => {
          setFieldData(INITIALFILTERS);
        }}
      >
        Clear Filters
      </button>
      <h3>List of expenses</h3>
      {loading && (
        <p>
          <FontAwesomeIcon icon={faCircleNotch} spin />
        </p>
      )}
      {error && <p>{error}</p>}

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Name</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Budget</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp, idx) => {
            if (idx === expenses.length - 1) {
              return (
                <tr ref={lastExpenseRef} key={idx}>
                  <ExpenseItem expense={exp} />
                </tr>
              );
            }
            return (
              <tr key={idx}>
                <ExpenseItem expense={exp} />
              </tr>
            );
          })}
        </tbody>
      </table>

      {expenses.length === 0 && !loading && !error && <p>No expenses found</p>}
    </div>
  );
};
export default Espenses;
