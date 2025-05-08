import { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getCategory,
  editCategory,
  deleteCategory,
  selectCategoryError,
  selectCategoryLoading,
} from "../store/categorySlice";
import { selectToken } from "../store/authSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

/** Edit Category Component
 *
 * Allow user to modify information for the category
 */
const EditCategory = () => {
  const { categoryName } = useParams();
  const [categoryData, setCategoryData] = useState({ name: "" });
  const loading = useSelector(selectCategoryLoading);
  const error = useSelector(selectCategoryError);
  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Load category data on render
  useEffect(() => {
    const fetchData = async () => {
      const response = await dispatch(
        getCategory({ token, name: categoryName })
      ).unwrap();
      setCategoryData(response);
    };
    fetchData();
  }, [categoryName, dispatch, token]);

  // Form update handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData((oldData) => ({
      ...oldData,
      [name]: value,
    }));
  };

  // Send update request to the server with the information from the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(
      editCategory({ token, name: categoryName, data: categoryData })
    ).unwrap();
    if (response) {
      setCategoryData(response);
    }
  };

  // Sends the delete request once the delete button is clicked
  const handleDelete = async (evt) => {
    evt.preventDefault();
    const response = await dispatch(
      deleteCategory({ token, name: categoryName })
    ).unwrap();
    if (response) {
      navigate("/categories");
    }
  };

  if (!token) {
    return <Navigate to="/" />;
  }
  return (
    <div>
      <h1>Edit Category</h1>
      {loading && (
        <p>
          Loading <FontAwesomeIcon icon={faCircleNotch} spin />
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="categoryName">Category Name:</label>
          <input
            type="text"
            id="categoryName"
            name="name"
            value={categoryData.name}
            onChange={handleChange}
          />
        </div>
        <button type="button" onClick={() => window.history.back()}>
          Back
        </button>
        <button type="submit">Update Category</button>
        <button type="button" onClick={handleDelete}>
          Delete Category
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};
export default EditCategory;
