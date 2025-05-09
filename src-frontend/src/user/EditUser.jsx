import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import {
  editUser,
  selectUser,
  selectUserError,
  selectUserLoading,
  selectToken,
} from "../store/authSlice";

const EditUser = () => {
  const INITIALFORM = {
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    image_url: "",
  };
  const [formData, setFormData] = useState(INITIALFORM);
  const user = useSelector(selectUser);
  const error = useSelector(selectUserError);
  const loading = useSelector(selectUserLoading);
  const token = useSelector(selectToken);
  const dispatch = useDispatch();

  useEffect(() => {
    setFormData(user);
  }, [user]);

  // Handles save button click, send updated user information to store
  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const { username, last_logged, ...data } = formData;
    const response = await dispatch(
      editUser({ token, username, data })
    ).unwrap();
    if (response) setFormData(response);
  };

  // Form update handler
  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData((old) => ({ ...old, [name]: value }));
  };

  if (!token) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <div>
        <img
          src={user.image_url}
          alt="User"
          style={{ width: "100px", height: "100px", objectFit: "contain" }}
        />
      </div>
      <div>
        <p>Edit user information</p>
        <form onSubmit={handleSubmit} style={{ maxWidth: "600px" }}>
          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              aria-describedby="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="firstname">First Name</label>
            <input
              type="text"
              name="first_name"
              id="firstname"
              aria-describedby="First Name"
              value={formData.first_name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="lastname">Last Name</label>
            <input
              type="text"
              name="last_name"
              id="lastname"
              aria-describedby="Last Name"
              value={formData.last_name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              name="email"
              id="email"
              aria-describedby="E-mail"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="image">Image URL</label>
            <input
              type="URL"
              name="image_url"
              id="image"
              aria-describedby="Image URL"
              value={formData.image_url}
              onChange={handleChange}
            />
          </div>

          <button type="submit">Update</button>
          {loading && <p>Loading...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </div>
    </>
  );
};

export default EditUser;
