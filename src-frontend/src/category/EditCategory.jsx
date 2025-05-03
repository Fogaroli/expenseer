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

const EditCategory = () => {
  const { categoryName } = useParams();
  const [categoryData, setCategoryData] = useState({ name: "" });
  const loading = useSelector(selectCategoryLoading);
  const error = useSelector(selectCategoryError);
  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await dispatch(
        getCategory({ token, name: categoryName })
      ).unwrap();
      setCategoryData(response);
    };
    fetchData();
  }, [categoryName, dispatch, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData((oldData) => ({
      ...oldData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(
      editCategory({ token, name: categoryName, data: categoryData })
    ).unwrap();
    if (response) {
      setCategoryData(response);
    }
  };

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
    return <Navigate to="/login" />;
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
        <Link to={`/categories`}>Return</Link>
        <button type="submit">Update Category</button>
        <button type="button" onClick={handleDelete}>
          Delete Category
        </button>
      </form>
      {error && <p className="text-danger">{error}</p>}
    </div>
  );
};
export default EditCategory;
