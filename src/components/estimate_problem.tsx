import type { EstimateProblem } from '../config/problem_types';
import { EstimateGrid } from './estimate_grid';

interface EstimateProblemProps {
  problem: EstimateProblem;
}

export function EstimateProblemComponent({ problem }: EstimateProblemProps) {
  return (
    <div className="print-break-inside-avoid p-2 inline-block">
      <EstimateGrid
        operation={problem.operation}
        operand1={problem.operand1}
        operand2={problem.operand2}
        rounded1={problem.rounded1}
        rounded2={problem.rounded2}
        estimateResult={problem.estimateResult}
        exactResult={problem.exactResult}
      />
    </div>
  );
}
