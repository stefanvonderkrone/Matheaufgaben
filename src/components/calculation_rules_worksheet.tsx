import type { CalculationRulesProblem } from '../config/problem_types';

const LABELS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];

interface CalculationRulesWorksheetProps {
  problems: CalculationRulesProblem[];
}

export function CalculationRulesWorksheet({ problems }: CalculationRulesWorksheetProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-8 space-y-8 print:space-y-6">
      {problems.map((problem, index) => {
        const label = LABELS[index] ?? String(index + 1);

        return (
          <div
            key={problem.id}
            className="print-break-inside-avoid text-2xl sm:text-3xl print:text-[16pt] font-medium tracking-wide"
          >
            <span className="inline-block w-10 sm:w-12 print:w-[12mm]">{label})</span>
            <span>{problem.expression} = </span>
          </div>
        );
      })}
    </div>
  );
}
