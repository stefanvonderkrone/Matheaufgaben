import type { MultiplicationProblem } from '../config/problem_types';
import { MultiplicationGrid } from './multiplication_grid';

interface MultiplicationProblemProps {
  problem: MultiplicationProblem;
}

export function MultiplicationProblemComponent({ problem }: MultiplicationProblemProps) {
  return (
    <div className="print-break-inside-avoid p-2 inline-block">
      <MultiplicationGrid
        factor1={problem.factor1}
        factor2={problem.factor2}
      />
    </div>
  );
}
