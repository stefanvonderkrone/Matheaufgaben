import type { DivisionProblem } from '../config/problem_types';
import { DivisionProblemComponent } from './division_problem';

interface DivisionWorksheetProps {
  problems: DivisionProblem[];
}

export function DivisionWorksheet({ problems }: DivisionWorksheetProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 p-2 sm:p-4">
      {problems.map((problem) => (
        <div key={problem.id} className="flex justify-center overflow-x-auto">
          <DivisionProblemComponent problem={problem} />
        </div>
      ))}
    </div>
  );
}
