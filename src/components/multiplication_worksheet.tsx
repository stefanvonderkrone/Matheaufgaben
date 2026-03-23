import type { MultiplicationProblem } from "../config/problem_types";
import { MultiplicationProblemComponent } from "./multiplication_problem";

interface MultiplicationWorksheetProps {
  problems: MultiplicationProblem[];
}

export function MultiplicationWorksheet({ problems }: MultiplicationWorksheetProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 p-2 sm:p-4 print-worksheet-2col">
      {problems.map((problem) => (
        <div key={problem.id} className="flex overflow-x-auto justify-start">
          <MultiplicationProblemComponent problem={problem} />
        </div>
      ))}
    </div>
  );
}
