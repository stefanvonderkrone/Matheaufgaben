import type { EstimateProblem } from "../config/problem_types";
import { EstimateProblemComponent } from "./estimate_problem";

interface EstimateWorksheetProps {
  problems: EstimateProblem[];
}

export function EstimateWorksheet({ problems }: EstimateWorksheetProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 p-2 sm:p-4 print-worksheet-estimate">
      {problems.map((problem) => (
        <div key={problem.id} className="flex overflow-x-auto justify-start">
          <EstimateProblemComponent problem={problem} />
        </div>
      ))}
    </div>
  );
}
