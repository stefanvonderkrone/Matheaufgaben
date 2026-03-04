import type { DivisionProblem } from '../config/problem_types';
import { DivisionProblemComponent } from './division_problem';

interface DivisionWorksheetProps {
  problems: DivisionProblem[];
}

export function DivisionWorksheet({ problems }: DivisionWorksheetProps) {
  // Check if we have 4-digit dividends to determine print layout
  const has4DigitDividends = problems.length > 0 && problems[0].dividend >= 1000;
  const printClass = has4DigitDividends ? 'print-worksheet-4digit' : 'print-worksheet';
  
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 p-2 sm:p-4 ${printClass}`}>
      {problems.map((problem) => (
        <div key={problem.id} className="flex justify-center overflow-x-auto">
          <DivisionProblemComponent problem={problem} />
        </div>
      ))}
    </div>
  );
}
