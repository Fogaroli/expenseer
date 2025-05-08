import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectToken } from "../store/authSlice";
import Stocks from "./Stocks";
import Exchanges from "./Exchanges";

const indexes = [<Stocks />, <Exchanges />];

/** Main Indexes component
 * Should provide access to stocks and exchange rates in a carousel
 */
const Indexes = () => {
  const [showing, setShowing] = useState(0);
  const token = useSelector(selectToken);
  if (!token) {
    return <Navigate to="/" />;
  }

  const prev = () => setShowing((c) => (c === 0 ? indexes.length - 1 : c - 1));
  const next = () => setShowing((c) => (c === indexes.length - 1 ? 0 : c + 1));

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <button onClick={prev}>&lt;</button>
        <span style={{ margin: "0 2rem" }}>{indexes[showing]}</span>
        <button onClick={next}>&gt;</button>
      </div>
    </>
  );
};

export default Indexes;
