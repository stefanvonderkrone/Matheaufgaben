import { SeededRandom } from './random_generator';
import type { NumberLineProblem } from '../config/problem_types';
import { numberLineConfig } from '../config/math_config';

export function generateNumberLineProblems(seed: number): NumberLineProblem[] {
  const rng = new SeededRandom(seed);
  const problems: NumberLineProblem[] = [];

  while (problems.length < numberLineConfig.problemsPerPage) {
    const a = rng.nextInt(numberLineConfig.minValue, numberLineConfig.maxValue);
    const b = rng.nextInt(numberLineConfig.minValue, numberLineConfig.maxValue);

    if (a >= b) {
      continue;
    }

    problems.push({
      id: `numberline-${problems.length}`,
      type: 'numberLine',
      start: a,
      end: b,
    });
  }

  return problems;
}
