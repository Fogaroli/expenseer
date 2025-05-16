import { useState } from "react";
import useExchange from "../customHook/useExchange";
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
  MenuItem,
  Button,
  IconButton,
  CircularProgress,
  Paper,
} from "@mui/material";

/** Exchange rates components
 *
 * Should provide updates exchange rates for the relations already pinned by the user.
 * Should allow search for a new exchange rate and pin to the user account
 */
const Exchanges = () => {
  const INITIALDATA = {
    currency1: "",
    currency2: "",
  };
  const [inputData, setInputData] = useState(INITIALDATA);
  const {
    exchangeData,
    availableCurrency,
    instantRate,
    loading,
    error,
    addExchange,
    deleteExchange,
    getExchange,
  } = useExchange();

  // Delete a currency exchange registered to the user
  const handleDelete = (evt) => {
    const currency1 = evt.currentTarget.dataset.currency1;
    const currency2 = evt.currentTarget.dataset.currency2;
    deleteExchange(currency1, currency2);
  };

  // Add a currency exchange to the user
  const handleAdd = (evt) => {
    const currency1 = evt.currentTarget.dataset.currency1;
    const currency2 = evt.currentTarget.dataset.currency2;
    addExchange(currency1, currency2);
  };

  // Form update handler
  const handleChange = (evt) => {
    let { name, value } = evt.target;
    setInputData((oldData) => ({ ...oldData, [name]: value }));
  };

  // Handle form submission, should trigger reading the selected exchange rate
  const handleSubmit = (evt) => {
    evt.preventDefault();
    getExchange(inputData.currency1, inputData.currency2);
    setInputData(INITIALDATA);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Currency Exchange
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
        {exchangeData &&
          exchangeData.map((exchange, idx) => (
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
                {exchange.currency1} / {exchange.currency2}: {exchange.rate}
              </span>
              <IconButton
                data-currency1={exchange.currency1}
                data-currency2={exchange.currency2}
                onClick={handleDelete}
                size="small"
                color="error"
              >
                <FontAwesomeIcon icon={faThumbtackSlash} />
              </IconButton>
            </Paper>
          ))}
      </Box>
      <Typography variant="subtitle1" gutterBottom>
        Choose an exchange
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            select
            name="currency1"
            label="From"
            value={inputData.currency1}
            onChange={handleChange}
            size="small"
            sx={{ minWidth: 100 }}
          >
            <MenuItem value="" disabled>
              {availableCurrency && availableCurrency.length > 0
                ? "Select currency"
                : ""}
            </MenuItem>
            {availableCurrency &&
              availableCurrency.map((currency, idx) => (
                <MenuItem key={idx} value={currency}>
                  {currency}
                </MenuItem>
              ))}
          </TextField>
          <Typography variant="body1">→</Typography>
          <TextField
            select
            name="currency2"
            label="To"
            value={inputData.currency2}
            onChange={handleChange}
            size="small"
            sx={{ minWidth: 100 }}
          >
            <MenuItem value="" disabled>
              {availableCurrency && availableCurrency.length > 0
                ? "Select currency"
                : ""}
            </MenuItem>
            {availableCurrency &&
              availableCurrency.map((currency, idx) => (
                <MenuItem key={idx} value={currency}>
                  {currency}
                </MenuItem>
              ))}
          </TextField>
          <Button type="submit" variant="contained" size="small">
            Check Rate
          </Button>
        </Stack>
      </Box>
      {instantRate && (
        <Paper
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
            {instantRate.currency1} / {instantRate.currency2}:{" "}
            {instantRate.rate}
          </span>
          <IconButton
            data-currency1={instantRate.currency1}
            data-currency2={instantRate.currency2}
            onClick={handleAdd}
            size="small"
            color="primary"
          >
            <FontAwesomeIcon icon={faThumbtack} />
          </IconButton>
        </Paper>
      )}
    </Box>
  );
};

export default Exchanges;
