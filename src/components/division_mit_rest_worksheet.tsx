import type { DivisionWithRemainderProblem } from '../config/problem_types';
import { DivisionMitRestProblemComponent } from './division_mit_rest_problem';

interface DivisionMitRestWorksheetProps {
  problems: DivisionWithRemainderProblem[];
}

export function DivisionMitRestWorksheet({
  problems,
}: DivisionMitRestWorksheetProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 p-2 sm:p-4 print-worksheet-2col">
      {problems.map((problem) => (
        <div
          key={problem.id}
          className="flex overflow-x-auto justify-start print-break-inside-avoid"
        >
          <DivisionMitRestProblemComponent problem={problem} />
        </div>
      ))}
    </div>
  );
}
