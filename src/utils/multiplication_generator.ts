import { SeededRandom } from './random_generator';
import type { MultiplicationProblem } from '../config/problem_types';
import { multiplicationConfig } from '../config/math_config';

export function generateMultiplicationProblems(
  count: number,
  seed: number
): MultiplicationProblem[] {
  const rng = new SeededRandom(seed);
  const problems: MultiplicationProblem[] = [];

  while (problems.length < count) {
    const factor1 = rng.nextInt(
      multiplicationConfig.factor1Min,
      multiplicationConfig.factor1Max
    );
    const factor2 = rng.nextInt(
      multiplicationConfig.factor2Min,
      multiplicationConfig.factor2Max
    );

    problems.push({
      id: `mult-${problems.length}`,
      type: 'multiplication',
      factor1,
      factor2,
      product: factor1 * factor2,
    });
  }

  return problems;
}

export function calculateChecksum(number: number): number {
  return number
    .toString()
    .split('')
    .reduce((sum, digit) => sum + parseInt(digit, 10), 0);
}
