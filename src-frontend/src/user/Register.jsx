import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  register,
  selectUserError,
  selectUser,
  selectUserLoading,
} from "../store/authSlice";

const Register = () => {
  const cleanForm = {
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    email: "",
  };
  const [formData, setFormData] = useState(cleanForm);
  const dispatch = useDispatch();
  const error = useSelector(selectUserError);
  const loading = useSelector(selectUserLoading);
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      await dispatch(register(formData)).unwrap();
      setFormData(cleanForm);
      navigate("/");
    } catch (err) {
      console.error("Registration failed: ", err);
    }
  };

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData((old) => ({ ...old, [name]: value }));
  };

  return (
    <>
      <div>
        {user ? <p>Welcome, {user.first_name}!</p> : <p>Please register</p>}
      </div>
      <p>Create your free account now</p>
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
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            aria-describedby="password"
            value={formData.password}
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
        <div className="mb-3">
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

        <button type="submit">Register</button>
        {loading && <p>Loading...</p>}
        {error && <p className="text-danger">{error}</p>}
      </form>
    </>
  );
};

export default Register;
