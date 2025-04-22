import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  login,
  selectError,
  selectUser,
  selectLoading,
} from "../store/authSlice";

const Login = () => {
  const emptyForm = { username: "", password: "" };
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(emptyForm);
  const error = useSelector(selectError);
  const loading = useSelector(selectLoading);
  const user = useSelector(selectUser);

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    dispatch(login(formData));
    setFormData(emptyForm);
  };

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData((old) => ({ ...old, [name]: value }));
  };

  return (
    <>
      <div>
        {user ? <p>Welcome, {user.first_name}!</p> : <p>Please log in.</p>}
      </div>
      <p className="h3 m-4">Enter your credentials in the form below</p>
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
        <button type="submit">Submit</button>
        {loading && <p>Loading...</p>}
        {error && <p className="text-danger">{error}</p>}
        <p>
          Don't have an account? <a href="/register">Sign Up</a>
        </p>
      </form>
    </>
  );
};

export default Login;
