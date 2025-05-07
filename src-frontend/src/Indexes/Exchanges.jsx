import { useState } from "react";
import { useExchange } from "../customHook/useExchange";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleNotch,
  faThumbtackSlash,
  faThumbtack,
} from "@fortawesome/free-solid-svg-icons";

const Exchanges = () => {
  const INITIALDATA = {
    currency1: "EUR",
    currency2: "USD",
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

  const handleDelete = (evt) => {
    const currency1 = evt.currentTarget.dataset.currency1;
    const currency2 = evt.currentTarget.dataset.currency2;
    deleteExchange(currency1, currency2);
  };

  const handleAdd = (evt) => {
    const currency1 = evt.currentTarget.dataset.currency1;
    const currency2 = evt.currentTarget.dataset.currency2;
    addExchange(currency1, currency2);
  };

  const handleChange = (evt) => {
    let { name, value } = evt.target;
    setInputData((oldData) => ({ ...oldData, [name]: value }));
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    getExchange(inputData.currency1, inputData.currency2);
    setInputData(INITIALDATA);
  };

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
              <FontAwesomeIcon
                data-currency1={exchange.currency1}
                data-currency2={exchange.currency2}
                onClick={handleDelete}
                icon={faThumbtackSlash}
              />
            </div>
          );
        })}
      <p>Choose an exchange</p>
      <form onSubmit={handleSubmit}>
        <select
          name="currency1"
          aria-description="First Currency"
          value={inputData.currency1}
          onChange={handleChange}
        >
          {availableCurrency &&
            availableCurrency.map((currency, idx) => {
              return (
                <option key={idx} value={currency}>
                  {currency}
                </option>
              );
            })}
        </select>
        --
        <select
          name="currency2"
          aria-description="Second Currency"
          value={inputData.currency2}
          onChange={handleChange}
        >
          {availableCurrency &&
            availableCurrency.map((currency, idx) => {
              return (
                <option key={idx} value={currency}>
                  {currency}
                </option>
              );
            })}
        </select>
        <button type="submit">Check Rate</button>
      </form>
      {instantRate && (
        <div>
          {instantRate.currency1} -- {instantRate.currency2} {instantRate.rate}
          <FontAwesomeIcon
            data-currency1={instantRate.currency1}
            data-currency2={instantRate.currency2}
            onClick={handleAdd}
            icon={faThumbtack}
          />
        </div>
      )}
    </>
  );
};

export default Exchanges;
