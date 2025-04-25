import { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getCategories,
  selectCategories,
  selectLoading,
  selectError,
} from "../store/categorySlice";
import { selectToken } from "../store/authSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

const Categories = () => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const token = useSelector(selectToken);

  useEffect(() => {
    if (token && categories.length === 0) {
      dispatch(getCategories(token));
    }
  }, [token, categories.length, dispatch]);

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <h1 className="h3 m-4">Categories</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}
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
