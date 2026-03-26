import type { MixedProblem } from '../utils/mixed_problems_generator';
import { DivisionProblemComponent } from './division_problem';
import { DivisionMitRestProblemComponent } from './division_mit_rest_problem';
import { MultiplicationProblemComponent } from './multiplication_problem';

interface MixedWorksheetProps {
  problems: MixedProblem[];
}

export function MixedWorksheet({ problems }: MixedWorksheetProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 p-2 sm:p-4 print-worksheet-2col">
      {problems.map((problem) => (
        <div key={problem.id} className="flex overflow-x-auto justify-start print-break-inside-avoid">
          {problem.type === 'division' && (
            <DivisionProblemComponent problem={problem} />
          )}
          {problem.type === 'divisionWithRemainder' && (
            <DivisionMitRestProblemComponent problem={problem} />
          )}
          {problem.type === 'multiplication' && (
            <MultiplicationProblemComponent problem={problem} />
          )}
        </div>
      ))}
    </div>
  );
}
