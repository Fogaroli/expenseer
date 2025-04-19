import { useState, useEffect } from "react";

const Register = () => {
  const cleanForm = {
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
  };
  const [formData, setFormData] = useState(cleanForm);


  const handleSubmit = async (evt) => {
    evt.preventDefault();

  };

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData((old) => ({ ...old, [name]: value }));
  };


  return (
    <>
      <p>Create your free account now</p>
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
        <div>
          <label htmlFor="firstname" >
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            id="firstname"
            aria-describedby="First Name"
            value={formData.firstname}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="lastname" >
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            id="lastname"
            aria-describedby="Last Name"
            value={formData.lastname}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="email">
            E-mail
          </label>
          <input
            type="email"
            name="email"
            id="email"
            aria-describedby="E-mail"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <button type="submit">
          Register
        </button>
      </form>
    </>
  );
};

export default Register;
