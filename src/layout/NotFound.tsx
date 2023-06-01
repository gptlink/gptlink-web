import { Link } from 'react-router-dom';

export default function NoMatch() {
  return (
    <div className="p-10 bg-red-400">
      <h2>404</h2>
      <p className="p-10 bg-green-400">
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}
