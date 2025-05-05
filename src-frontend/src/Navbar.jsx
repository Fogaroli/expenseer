import { NavLink } from "react-router-dom";
import logo from "./assets/expenseer_logo.svg";
import { selectUser, logout } from "./store/authSlice";
import { useSelector, useDispatch } from "react-redux";

const Navbar = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const logoutHandler = () => {
    dispatch(logout());
  };
  return (
    <>
      <nav>
        <div>
          <span>
            <img src={logo} alt="Expenseer Logo" />
          </span>
        </div>
        <div>
          <NavLink to="/">Home</NavLink>
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
