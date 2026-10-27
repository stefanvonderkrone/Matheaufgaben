import type {
  EvaluatePowerProblem,
  ProductAsPowerProblem,
  TenPowerProblem,
} from '../config/problem_types';

const LABELS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];

interface PowersWorksheetProps {
  productProblems: ProductAsPowerProblem[];
  evaluateProblems: EvaluatePowerProblem[];
  tenProblems: TenPowerProblem[];
}

function productText(problem: ProductAsPowerProblem): string {
  return Array.from({ length: problem.exponent }, () => String(problem.base)).join(' · ');
}

function tenText(problem: TenPowerProblem): string {
  return `1${'0'.repeat(problem.exponent)}`;
}

export function PowersWorksheet({
  productProblems,
  evaluateProblems,
  tenProblems,
}: PowersWorksheetProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 space-y-12 print:space-y-8">
      <section className="space-y-4 print:space-y-3">
        <h2 className="text-xl sm:text-2xl print:text-[14pt] font-semibold">Schreibe als Potenz</h2>
        {productProblems.map((problem, index) => (
          <p
            key={problem.id}
            className="print-break-inside-avoid text-lg sm:text-xl print:text-[13pt] leading-relaxed"
          >
            <span className="inline-block w-8">{LABELS[index] ?? index + 1})</span>
            {productText(problem)} =
          </p>
        ))}
      </section>

      <section className="space-y-4 print:space-y-3">
        <h2 className="text-xl sm:text-2xl print:text-[14pt] font-semibold">
          Schreibe als Produkt und berechne anschließend das Ergebnis
        </h2>
        {evaluateProblems.map((problem, index) => (
          <p
            key={problem.id}
            className="print-break-inside-avoid text-lg sm:text-xl print:text-[13pt]"
          >
            <span className="inline-block w-8">{LABELS[index] ?? index + 1})</span>
            {problem.base}
            <sup>{problem.exponent}</sup> =
          </p>
        ))}
      </section>

      <section className="space-y-4 print:space-y-3">
        <h2 className="text-xl sm:text-2xl print:text-[14pt] font-semibold">Schreibe als Potenz</h2>
        {tenProblems.map((problem, index) => (
          <p
            key={problem.id}
            className="print-break-inside-avoid text-lg sm:text-xl print:text-[13pt]"
          >
            <span className="inline-block w-8">{LABELS[index] ?? index + 1})</span>
            {tenText(problem)} =
          </p>
        ))}
      </section>
    </div>
  );
}
