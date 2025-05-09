import Box from "@mui/material/Box";

const Layout = ({ children }) => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pt: { xs: 7, sm: 8 },
      }}
    >
      {children}
    </Box>
  );
};

export default Layout;
