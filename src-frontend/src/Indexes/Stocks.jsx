import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectToken } from "../store/authSlice";
import ExpenseerAPI from "../helper/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

const Stocks = () => {
  const [stocksData, setStocksData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = useSelector(selectToken);

  useEffect(() => {
    const getStocksData = async () => {
      setLoading(true);
      setError(null);
      try {
        ExpenseerAPI.token = token;
        const response = await ExpenseerAPI.getStocks();
        if (!response) {
          throw new Error("Error retrieving stocks");
        }
        setStocksData(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getStocksData();
  }, [token]);

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
            </div>
          );
        })}
    </>
  );
};

export default Stocks;
