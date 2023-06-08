import { Outlet } from 'react-router-dom';
import Header from './Header';

const App = () => {
  return (
    <div className="flex h-screen flex-col bg-white p-4 pt-0 text-sm dark:bg-gray-900 dark:text-slate-100">
      <Header />
      <Outlet />
    </div>
  );
};

export default App;
