import { useState } from "react";
import useExchange from "../customHook/useExchange";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleNotch,
  faThumbtackSlash,
  faThumbtack,
} from "@fortawesome/free-solid-svg-icons";

/** Exchange rates components
 *
 * Should provide updates exchange rates for the relations already pinned by the user.
 * Should allow search for a new exchange rate and pin to the user account
 */
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
