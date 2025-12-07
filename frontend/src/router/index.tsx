import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <h1>Hello</h1>,
    // children: [
    //   {
    //     path: '',
    //     element: <>Hello</>,
    //   },
    // ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
