import { createBrowserRouter } from 'react-router-dom';
import { authLoader } from '@/middleware/auth';

import Login from '@/pages/login';
import Chat from '@/pages/chat';
import User from '@/pages/user';
import Pay from '@/pages/pay';
import Layout from '@/layout/index';
import ErrorPage from '@/pages/error-page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    loader: () => authLoader(),
    children: [
      {
        path: 'chat',
        element: <Chat />,
      },
      {
        path: 'user',
        element: <User />,
      },
      {
        path: 'pay',
        element: <Pay />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <ErrorPage />,
  },
]);

export default router;
