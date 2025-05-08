import { useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getCategories,
  selectCategories,
  selectCategoryLoading,
  selectCategoryError,
} from "../store/categorySlice";
import { selectToken } from "../store/authSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

/** Categories components
 *
 * Lists all categories created by the user
 * Data extracted from Redux store
 */
const Categories = () => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const loading = useSelector(selectCategoryLoading);
  const error = useSelector(selectCategoryError);
  const token = useSelector(selectToken);

  // Load categories on page render
  useEffect(() => {
    if (token && categories.length === 0) {
      dispatch(getCategories(token));
    }
  }, [token, categories.length, dispatch]);

  if (!token) {
    return <Navigate to="/" />;
  }
  return (
    <>
      <h1>Categories</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {categories.map((category, idx) => (
          <li key={idx}>
            <Link to={`/categories/${category.name}`}>{category.name}</Link>
            <Link to={`/categories/${category.name}/edit`}>
              <FontAwesomeIcon icon={faPenToSquare} />
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/add-category">Add Category</Link>
    </>
  );
};

export default Categories;
