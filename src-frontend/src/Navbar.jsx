import { useNavigate } from "react-router-dom";
import logo from "./assets/LOGO.svg";
import { useEffect, useState } from "react";
import { selectUser, logoutAll } from "./store/authSlice";
import { useSelector, useDispatch } from "react-redux";

import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

const pages = ["Dashboard", "Categories", "Budgets", "Expenses", "Indexes"];
const pagesNotLogged = ["Login", "Sign Up"];
const settings = ["Profile", "Logout"];

/**Main navigation bar
 * Should provide access to main page links and allow user logout
 */
const Navbar = () => {
  const [loggingOut, setLoggingOut] = useState(false);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redirect users to homepage when logged out
  useEffect(() => {
    if (loggingOut && user === null) {
      navigate("/");
      setLoggingOut(false);
    }
  }, [loggingOut, user, navigate]);

  // Handle clicks to the logout button
  const logoutHandler = () => {
    dispatch(logoutAll());
    setLoggingOut(true);
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNavigation = (path) => {
    handleCloseNavMenu();
    navigate(`/${path.toLowerCase()}`);
  };

  const handleSettingNavigation = (setting) => {
    handleCloseUserMenu();
    if (setting === "Logout") {
      logoutHandler();
    } else if (setting === "Profile") {
      navigate("/user");
    }
  };

  return (
    <>
      <AppBar position="fixed" sx={{ mb: 0 }}>
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              minHeight: { xs: 56, sm: 64 },
              px: 0,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                component="img"
                onClick={() => navigate("/")}
                sx={{
                  display: { xs: "none", md: "flex" },
                  mr: 1,
                  width: 40,
                  height: 40,
                  objectFit: "contain",
                  cursor: "pointer",
                }}
                alt="Expenseer"
                src={logo}
              />
              <Typography
                variant="h5"
                noWrap
                component="span"
                onClick={() => navigate("/")}
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                Expenseer
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: "block", md: "none" } }}
              >
                {user
                  ? pages.map((page) => (
                      <MenuItem
                        key={page}
                        onClick={() => handleNavigation(page)}
                      >
                        <Typography sx={{ textAlign: "center" }}>
                          {page}
                        </Typography>
                      </MenuItem>
                    ))
                  : pagesNotLogged.map((page) => (
                      <MenuItem
                        key={page}
                        onClick={() => handleNavigation(page)}
                      >
                        <Typography sx={{ textAlign: "center" }}>
                          {page}
                        </Typography>
                      </MenuItem>
                    ))}
              </Menu>
            </Box>

            <Typography
              variant="h5"
              noWrap
              component="span"
              onClick={() => navigate("/")}
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Expenseer
            </Typography>

            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 1,
              }}
            >
              {user
                ? pages.map((page) => (
                    <Button
                      key={page}
                      onClick={() => handleNavigation(page)}
                      sx={{ my: 2, color: "white", display: "block" }}
                    >
                      {page}
                    </Button>
                  ))
                : pagesNotLogged.map((page) => (
                    <Button
                      key={page}
                      onClick={() => handleNavigation(page)}
                      sx={{ my: 2, color: "white", display: "block" }}
                    >
                      {page}
                    </Button>
                  ))}
            </Box>

            {user && (
              <Box sx={{ flexGrow: 0, ml: 2 }}>
                <Tooltip title={`${user.first_name} ${user.last_name}`}>
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt={`${user.first_name} ${user.last_name}`}
                      src={user.image_url}
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting}
                      onClick={() => handleSettingNavigation(setting)}
                    >
                      <Typography sx={{ textAlign: "center" }}>
                        {setting}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};
export default Navbar;
