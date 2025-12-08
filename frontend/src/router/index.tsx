import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RfpPage } from '@/components/pages';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RfpPage />,
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
