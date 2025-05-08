import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "./store/authSlice";

/**Homepage content
 * Should provide information of the tool and a sign in and registration link for new users.
 * Registered users should be redirected to the dashboards page
 */
const Homepage = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  // Handle clicks to login or registration buttons
  const handleClick = (evt) => {
    evt.preventDefault();
    navigate(`/${evt.target.name}`);
  };

  // Navigates to dashboard once user is logged in.
  useEffect(() => {
    if (user) navigate("/dashboards");
  }, [user]);

  return (
    <>
      <div>
        <h1>Welcome to Expenseer</h1>
        <p>
          This application was build to help you take control of your financial
          life.
        </p>
      </div>
      <div>
        <button type="button" name="login" onClick={handleClick}>
          Login
        </button>
        <button type="button" name="register" onClick={handleClick}>
          Sign Up
        </button>
      </div>
    </>
  );
};

export default Homepage;
