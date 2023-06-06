import { Outlet } from 'react-router-dom';
import Header from './Header';

const App = () => {
  return (
    <div className="bg-white dark:bg-gray-900 dark:text-slate-100 h-screen flex flex-col p-4 pt-0 text-sm">
      <Header />
      <Outlet />
    </div>
  );
};

export default App;
