import { Routes, Route, Outlet } from 'react-router-dom';

import Header from './Header';
import NotFound from './NotFound';
import Home from '../pages/home';
import User from '../pages/user';
import Pay from '../pages/pay';

const App = () => {
  return (
    <div className="bg-white dark:bg-slate-800 dark:text-white h-screen">
      <Header />
      <Routes>
        <Route path="/" element={<Outlet />}>
          <Route index element={<Home />} />
          <Route path="user" element={<User />} />
          <Route path="pay" element={<Pay />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
