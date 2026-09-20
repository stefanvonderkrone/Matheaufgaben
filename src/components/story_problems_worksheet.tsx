import type { StoryProblem } from '../config/problem_types';

interface StoryProblemsWorksheetProps {
  problems: StoryProblem[];
}

export function StoryProblemsWorksheet({ problems }: StoryProblemsWorksheetProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 space-y-12 print:space-y-10">
      {problems.map((problem, index) => (
        <div key={problem.id} className="print-break-inside-avoid">
          <p className="text-lg sm:text-xl print:text-[12pt] leading-relaxed">
            <span className="font-semibold mr-2">{index + 1}.</span>
            {problem.prompt}
          </p>

          {problem.parts.length > 0 && (
            <div className="mt-4 ml-8 sm:ml-10 space-y-2 text-lg sm:text-xl print:text-[12pt]">
              {problem.parts.map((part) => (
                <p key={part.label}>
                  {part.label}) {part.text}
                </p>
              ))}
            </div>
          )}

          <div className="mt-6 h-20 print:h-[28mm]" />
        </div>
      ))}
    </div>
  );
}
