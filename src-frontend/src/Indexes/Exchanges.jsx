import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectToken } from "../store/authSlice";
import ExpenseerAPI from "../helper/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

const Exchanges = () => {
  const [exchangeData, setExchangeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = useSelector(selectToken);

  useEffect(() => {
    const getExchangesData = async () => {
      setLoading(true);
      setError(null);
      try {
        ExpenseerAPI.token = token;
        const response = await ExpenseerAPI.getExchanges();
        if (!response) {
          throw new Error("Error retrieving exchange rates");
        }
        setExchangeData(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getExchangesData();
  }, [token]);

  return (
    <>
      <p>Currency Exchange</p>
      {loading && (
        <p>
          <FontAwesomeIcon icon={faCircleNotch} spin />
        </p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {exchangeData &&
        exchangeData.map((exchange, idx) => {
          return (
            <div key={idx}>
              {exchange.currency1} {exchange.currency2} {exchange.rate}
            </div>
          );
        })}
    </>
  );
};

export default Exchanges;
