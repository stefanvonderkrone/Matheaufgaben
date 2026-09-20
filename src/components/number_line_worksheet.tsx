import type { NumberLineProblem } from '../config/problem_types';

const LABELS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];

interface NumberLineWorksheetProps {
  problems: NumberLineProblem[];
}

export function NumberLineWorksheet({ problems }: NumberLineWorksheetProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 space-y-10 print:space-y-8">
      {problems.map((problem, index) => {
        const label = LABELS[index] ?? String(index + 1);

        return (
          <div key={problem.id} className="print-break-inside-avoid">
            <p className="text-xl sm:text-2xl print:text-[14pt] font-medium">
              <span className="inline-block w-10 sm:w-12 print:w-[12mm]">{label})</span>
              Zeichne einen Zahlenstrahl.
            </p>
            <p className="text-xl sm:text-2xl print:text-[14pt] font-medium mt-1 ml-10 sm:ml-12 print:ml-[12mm]">
              Trage dort folgende Zahlen ein: {problem.start}; {problem.end}.
            </p>
            <div className="mt-4 h-16 print:h-[22mm] border-b border-dashed border-gray-300" />
          </div>
        );
      })}
    </div>
  );
}
