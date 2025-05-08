import { useState } from "react";
import {
  addCategory,
  selectCategoryError,
  selectCategoryLoading,
} from "../store/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import { selectToken } from "../store/authSlice";

/** Add category component
 *
 * Allows user to add a new expense category to its list
 */
const AddCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const error = useSelector(selectCategoryError);
  const loading = useSelector(selectCategoryLoading);
  const navigate = useNavigate();

  // Send new category data to the server once click submit
  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      await dispatch(addCategory({ token, name: categoryName })).unwrap();
      setCategoryName("");
      navigate("/categories");
    } catch (err) {
      console.error("Failed to add category: ", err);
    }
  };

  // Form update handler
  const handleChange = (evt) => {
    const { value } = evt.target;
    setCategoryName(value);
  };

  if (!token) {
    return <Navigate to="/" />;
  }
  return (
    <>
      <h1>Add Category</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: "600px" }}>
        <div>
          <label htmlFor="categoryName">Category Name</label>
          <input
            type="text"
            name="categoryName"
            id="categoryName"
            aria-describedby="categoryName"
            value={categoryName}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Add Category</button>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </>
  );
};

export default AddCategory;
