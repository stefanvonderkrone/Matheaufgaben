import { DivisionProblem } from '../config/problem_types';
import { DivisionProblemComponent } from './division_problem';

interface DivisionWorksheetProps {
  problems: DivisionProblem[];
}

export function DivisionWorksheet({ problems }: DivisionWorksheetProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {problems.map((problem) => (
        <div key={problem.id} className="flex justify-center">
          <DivisionProblemComponent problem={problem} />
        </div>
      ))}
    </div>
  );
}
