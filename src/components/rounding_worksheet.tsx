import type { RoundingRangeProblem, RoundingToPlaceProblem } from '../config/problem_types';

const LABELS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];

interface RoundingWorksheetProps {
  roundProblems: RoundingToPlaceProblem[];
  rangeProblems: RoundingRangeProblem[];
}

export function RoundingWorksheet({ roundProblems, rangeProblems }: RoundingWorksheetProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 space-y-12 print:space-y-8">
      <section className="space-y-4 print:space-y-3">
        <h2 className="text-xl sm:text-2xl print:text-[14pt] font-semibold">
          Runde zum nächsten 10er, 100er, 1000er
        </h2>
        {roundProblems.map((problem, index) => (
          <p
            key={problem.id}
            className="print-break-inside-avoid text-lg sm:text-xl print:text-[13pt]"
          >
            <span className="inline-block w-8">{LABELS[index] ?? index + 1})</span>
            Runde zum nächsten {problem.place}er: {problem.value}
          </p>
        ))}
      </section>

      <section className="space-y-4 print:space-y-3">
        <h2 className="text-xl sm:text-2xl print:text-[14pt] font-semibold">
          Gib den kleinsten und größten exakten Wert an
        </h2>
        {rangeProblems.map((problem, index) => (
          <div key={problem.id} className="print-break-inside-avoid">
            <p className="text-lg sm:text-xl print:text-[13pt]">
              <span className="inline-block w-8">{LABELS[index] ?? index + 1})</span>
              gerundet auf den nächsten {problem.place}er: {problem.rounded}
            </p>
            <p className="mt-2 ml-8 text-lg sm:text-xl print:text-[13pt] text-gray-700 print:text-black">
              kleinster Wert: ________ &nbsp;&nbsp; größter Wert: ________
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
