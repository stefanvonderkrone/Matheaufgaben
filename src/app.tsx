import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { IndexPage } from './pages/index_page';
import { DivisionPage } from './pages/division_page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <IndexPage />,
  },
  {
    path: '/division',
    element: <DivisionPage />,
  },
], {
  basename: '/',
});

export function App() {
  return <RouterProvider router={router} />;
}
