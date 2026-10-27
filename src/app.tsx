import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { IndexPage } from './pages/index_page';
import { DivisionPage } from './pages/division_page';
import { SchriftlicheDivisionMitRestPage } from './pages/schriftliche_division_mit_rest_page';
import { MultiplicationPage } from './pages/multiplication_page';
import { MixedProblemsPage } from './pages/mixed_problems_page';
import { EstimatePage } from './pages/estimate_page';
import { AdditionSubtractionPage } from './pages/addition_subtraction_page';
import { NumberLinePage } from './pages/number_line_page';
import { CalculationRulesPage } from './pages/calculation_rules_page';
import { StoryProblemsPage } from './pages/story_problems_page';
import { RoundingPage } from './pages/rounding_page';

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
  {
    path: '/addition-subtraktion-1',
    element: <AdditionSubtractionPage />,
  },
  {
    path: '/zahlenstrahl-1',
    element: <NumberLinePage />,
  },
  {
    path: '/rechenregeln-1',
    element: <CalculationRulesPage />,
  },
  {
    path: '/sachaufgaben-1',
    element: <StoryProblemsPage />,
  },
  {
    path: '/runden-1',
    element: <RoundingPage />,
  },
], {
  basename: '/',
});

export function App() {
  return <RouterProvider router={router} />;
}
