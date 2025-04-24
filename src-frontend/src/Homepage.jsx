import { useNavigate } from "react-router-dom";

const Homepage = () => {
    const navigate = useNavigate();

    const handleClick = (evt) => {
      evt.preventDefault();
      navigate(`/${evt.target.name}`);
    };

    return (
        <>
        <div>
            <h1>Welcome to Expenseer</h1>
            <p>This application was build to help you take control of your financial life.</p>
        </div>
        <div>
            <button type="button" name="login" className="btn btn-secondary m-4" onClick={handleClick}>Login</button>
            <button type="button" name="register" className="btn btn-secondary m-4" onClick={handleClick}>Sign Up</button>
        </div> 
        </>
    )
}

export default Homepage