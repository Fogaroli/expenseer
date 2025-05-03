import { useState } from "react";
import {
  addCategory,
  selectCategoryError,
  selectCategoryLoading,
} from "../store/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectToken } from "../store/authSlice";

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const error = useSelector(selectCategoryError);
  const loading = useSelector(selectCategoryLoading);
  const navigate = useNavigate();

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
  const handleChange = (evt) => {
    const { value } = evt.target;
    setCategoryName(value);
  };
  return (
    <>
      <h1 className="h3 m-4">Add Category</h1>
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
        {error && <p className="text-danger">{error}</p>}
      </form>
    </>
  );
};

export default AddCategory;
