import type { DivisionWithRemainderProblem } from '../config/problem_types';
import { DivisionMitRestGrid } from './division_mit_rest_grid';

interface DivisionMitRestProblemProps {
  problem: DivisionWithRemainderProblem;
}

export function DivisionMitRestProblemComponent({
  problem,
}: DivisionMitRestProblemProps) {
  return (
    <DivisionMitRestGrid
      dividend={problem.dividend}
      divisor={problem.divisor}
    />
  );
}
