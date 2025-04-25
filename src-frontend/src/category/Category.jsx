import { useParams, Link } from "react-router-dom";

const Category = () => {
  const { categoryName } = useParams();
  return (
    <div>
      <h1> {categoryName}</h1>
      <p>This is placeholder page.</p>
      <p>
        It should display a dashboard for the given category and the last
        expenses reported
      </p>

      <Link to="/categories">Go Back</Link>
      <Link to="/">See All</Link>
    </div>
  );
};

export default Category;
