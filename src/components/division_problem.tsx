import type { DivisionProblem } from '../config/problem_types';
import { DivisionGrid } from './division_grid';

interface DivisionProblemProps {
  problem: DivisionProblem;
}

export function DivisionProblemComponent({ problem }: DivisionProblemProps) {
  return (
    <div className="print-break-inside-avoid p-2 inline-block">
      <DivisionGrid 
        dividend={problem.dividend} 
        divisor={problem.divisor} 
      />
    </div>
  );
}
