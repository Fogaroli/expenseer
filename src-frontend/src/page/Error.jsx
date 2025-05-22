import { Link } from "react-router-dom";

const Error = ({ code }) => {
  return (
    <div className="error">
      <h1>Opps, That is not good!</h1>
      <h2>Seems there was an error!</h2>
      <h1>CODE - {code}</h1>
      <p>We had issues while processing your request.</p>
      <p>
        Please head back to our <Link to="/">Homepage</Link>.
      </p>
    </div>
  );
};

export default Error;
