import { useState } from "react";
import useStocks from "../customHook/useStocks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleNotch,
  faThumbtackSlash,
  faThumbtack,
} from "@fortawesome/free-solid-svg-icons";

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
    <>
      <p>Stock Values</p>
      {loading && (
        <p>
          <FontAwesomeIcon icon={faCircleNotch} spin />
        </p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {stocksData &&
        stocksData.map((stock, idx) => {
          return (
            <div key={idx}>
              {stock.symbol} {stock.value} {stock.variation}%
              <FontAwesomeIcon
                data-name={stock.symbol}
                onClick={handleDelete}
                icon={faThumbtackSlash}
              />
            </div>
          );
        })}
      <form onSubmit={handleSubmit}>
        <label htmlFor="search">Search Stock</label>
        <input
          type="text"
          name="search"
          id="search"
          aria-describedby="Search Stocks"
          value={searchInput}
          onChange={handleChange}
        />
        <button type="submit">Search</button>
      </form>
      {searchResults &&
        searchResults.map((result, idx) => {
          return (
            <div key={idx}>
              {result.symbol} - {result.name} -
              <FontAwesomeIcon
                data-name={result.symbol}
                onClick={handleAdd}
                icon={faThumbtack}
              />
            </div>
          );
        })}
    </>
  );
};

export default Stocks;
<FontAwesomeIcon icon={faThumbtackSlash} />;
