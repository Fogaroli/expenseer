import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "./assets/expenseer_logo.svg";
import { selectUser, logout } from "./store/authSlice";
import { useSelector, useDispatch } from "react-redux";

/**Main navigation bar
 * Should provide access to main page links and allow user logout
 */
const Navbar = () => {
  const [loggingOut, setLoggingOut] = useState(false);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle clicks to the logout button
  const logoutHandler = () => {
    dispatch(logout());
    setLoggingOut(true);
  };

  // Redirect users to homepage when logged out
  useEffect(() => {
    if (loggingOut && user === null) {
      navigate("/");
      setLoggingOut(false);
    }
  }, [loggingOut, user, navigate]);

  return (
    <>
      <nav>
        <div>
          <span>
            <img src={logo} alt="Expenseer Logo" />
          </span>
        </div>
        <div>
          {user !== null ? (
            <>
              <NavLink to="/dashboards">Dashboards</NavLink>
              <NavLink to="/categories">Categories</NavLink>
              <NavLink to="/budgets">Budgets</NavLink>
              <NavLink to="/expenses">Expenses</NavLink>
              <NavLink to="/indexes">Indexes</NavLink>
              <NavLink onClick={logoutHandler}>
                Logout({user.first_name})
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/">Home</NavLink>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </div>
      </nav>
    </>
  );
};
export default Navbar;
