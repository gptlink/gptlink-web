import { createBrowserRouter, redirect } from 'react-router-dom';

import { StoreKey } from '@/constants';

import Login from '@/pages/login';
import Chat from '@/pages/chat';
import User from '@/pages/user';
import Billing from '@/pages/billing';
import Layout from '@/layout/index';
import ErrorPage from '@/pages/error-page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    loader: () => {
      if (!localStorage.getItem(StoreKey.AccessToken)) {
        return redirect('/login');
      }
      return null;
    },
    children: [
      {
        path: 'chat',
        element: <Chat />,
        index: true,
      },
      {
        path: 'user',
        element: <User />,
      },
      {
        path: 'billing',
        element: <Billing />,
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
