import { Link } from 'react-router-dom';

export default function ErrorPage() {
  return (
    <div id="error-page">
      <div className="bg-red-400 p-10">
        <h2>404</h2>
        <p className="bg-green-400 p-10">
          <Link to="/home">Go to the home page</Link>
        </p>
      </div>
    </div>
  );
}
