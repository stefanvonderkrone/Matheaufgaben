import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { IndexPage } from './pages/index_page';
import { DivisionPage } from './pages/division_page';
import { SchriftlicheDivisionMitRestPage } from './pages/schriftliche_division_mit_rest_page';
import { MultiplicationPage } from './pages/multiplication_page';
import { MixedProblemsPage } from './pages/mixed_problems_page';
import { EstimatePage } from './pages/estimate_page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <IndexPage />,
  },
  {
    path: '/division',
    element: <DivisionPage />,
  },
  {
    path: '/schriftliche-division-mit-rest',
    element: <SchriftlicheDivisionMitRestPage />,
  },
  {
    path: '/multiplication',
    element: <MultiplicationPage />,
  },
  {
    path: '/sammelaufgaben',
    element: <MixedProblemsPage />,
  },
  {
    path: '/ueberschlag',
    element: <EstimatePage />,
  },
], {
  basename: '/',
});

export function App() {
  return <RouterProvider router={router} />;
}
