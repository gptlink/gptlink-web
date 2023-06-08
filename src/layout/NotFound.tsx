import { Link } from 'react-router-dom';

export default function NoMatch() {
  return (
    <div className="bg-red-400 p-10">
      <h2>404</h2>
      <p className="bg-green-400 p-10">
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}
