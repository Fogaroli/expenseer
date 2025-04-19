import { useState, useEffect } from "react";

const Login = () => {
    const emptyForm = { username: "", password: "" };
    const [formData, setFormData] = useState(emptyForm);

    const handleSubmit = async (evt) => {
      evt.preventDefault();
    };

    const handleChange = (evt) => {
      const { name, value } = evt.target;
      setFormData((old) => ({ ...old, [name]: value }));
    };

    return (
      <>
        <p className="h3 m-4">Enter your credentials in the form below</p>
        <form
          onSubmit={handleSubmit}
          style={{ maxWidth: "600px" }}
        >
          <div>
            <label htmlFor="username">
              Username
            </label>
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
            <label htmlFor="password">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              aria-describedby="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit">
            Submit
          </button>
        </form>
      </>
    );
};

export default Login;
