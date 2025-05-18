import { useState } from "react";
import useStocks from "../customHook/useStocks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbtackSlash,
  faThumbtack,
} from "@fortawesome/free-solid-svg-icons";
import {
  Typography,
  Box,
  Stack,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  Paper,
} from "@mui/material";

/** Stocks value components
 *
 * Should provide updates Stock values for stocks already pinned by the user.
 * Should allow search for new stocks and pin to the user account
 */
const Stocks = () => {
  const [searchInput, setSeachInput] = useState("");
  const {
    stocksData,
    searchResults,
    resultsError,
    loading,
    error,
    addStock,
    deleteStock,
    searchStocks,
    clearResults,
  } = useStocks();

  // Delete a stock registered to the user
  const handleDelete = (evt) => {
    const symbol = evt.currentTarget.dataset.name;
    deleteStock(symbol);
  };

  // Add a stock to the user
  const handleAdd = (evt) => {
    const symbol = evt.currentTarget.dataset.name;
    addStock(symbol);
    clearResults();
  };

  // Form update handler
  const handleChange = (evt) => {
    const { value } = evt.target;
    setSeachInput(value);
    clearResults();
  };

  // Handle for submission, should trigger searching for stocks
  const handleSubmit = (evt) => {
    evt.preventDefault();
    searchStocks(searchInput);
    setSeachInput("");
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Stock Values
      </Typography>
      {loading && (
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <Box sx={{ mb: 2 }}>
        {stocksData &&
          stocksData.map((stock, idx) => (
            <Paper
              key={idx}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1,
                mb: 1,
              }}
              variant="outlined"
            >
              <span>
                {stock.symbol} {stock.value} {stock.variation}%
              </span>
              <IconButton
                data-name={stock.symbol}
                onClick={handleDelete}
                size="small"
                color="error"
              >
                <FontAwesomeIcon icon={faThumbtackSlash} />
              </IconButton>
            </Paper>
          ))}
      </Box>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            label="Search Stock"
            name="search"
            value={searchInput}
            onChange={handleChange}
            size="small"
            sx={{ minWidth: 180 }}
          />
          <Button type="submit" variant="contained" size="small">
            Search
          </Button>
        </Stack>
      </Box>
      <Box>
        {resultsError && (
          <Typography color="error" sx={{ mb: 2 }}>
            {resultsError}
          </Typography>
        )}
        {searchResults &&
          searchResults.map((result, idx) => (
            <Paper
              key={idx}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1,
                mb: 1,
                bgcolor: "grey.100",
              }}
              variant="outlined"
            >
              <span>
                {result.symbol} - {result.name}
              </span>
              <IconButton
                data-name={result.symbol}
                onClick={handleAdd}
                size="small"
                color="primary"
              >
                <FontAwesomeIcon icon={faThumbtack} />
              </IconButton>
            </Paper>
          ))}
      </Box>
    </Box>
  );
};

export default Stocks;
<FontAwesomeIcon icon={faThumbtackSlash} />;
