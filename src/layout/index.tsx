import { Routes, Route, Outlet } from 'react-router-dom';

import Header from './Header';
import NotFound from './NotFound';
import Chat from '../pages/chat';
import User from '../pages/user';
import Pay from '../pages/pay';

const App = () => {
  return (
    <div className="bg-white dark:bg-gray-900 dark:text-slate-100 h-screen flex flex-col p-4 pt-0 text-sm">
      <Header />
      <Routes>
        <Route path="/" element={<Outlet />}>
          <Route index element={<Chat />} />
          <Route path="user" element={<User />} />
          <Route path="pay" element={<Pay />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
