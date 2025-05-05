import { useState } from "react";
import Stocks from "./Stocks";
import Exchanges from "./Exchanges";

const indexes = [<Stocks />, <Exchanges />];

const Indexes = () => {
  const [showing, setShowing] = useState(0);

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
