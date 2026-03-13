import { SeededRandom } from './random_generator';
import type { DivisionWithRemainderProblem } from '../config/problem_types';
import { divisionWithRemainderConfig } from '../config/math_config';

export function generateDivisionWithRemainderProblems(
  count: number,
  seed: number
): DivisionWithRemainderProblem[] {
  const rng = new SeededRandom(seed);
  const problems: DivisionWithRemainderProblem[] = [];

  let attempts = 0;
  const maxAttempts = count * 100;

  while (problems.length < count && attempts < maxAttempts) {
    attempts++;

    // Generate divisor (1-digit)
    const divisor = rng.nextInt(
      divisionWithRemainderConfig.divisorMin,
      divisionWithRemainderConfig.divisorMax
    );

    // Generate remainder (1 to divisor-1, never 0)
    const remainder = rng.nextInt(1, divisor - 1);

    // Generate quotient so that dividend is 4-6 digits
    // dividend = divisor * quotient + remainder
    // We need: 1000 <= dividend <= 999999
    // So: (1000 - remainder) / divisor <= quotient <= (999999 - remainder) / divisor
    const minQuotient = Math.ceil(
      (divisionWithRemainderConfig.dividendMin - remainder) / divisor
    );
    const maxQuotient = Math.floor(
      (divisionWithRemainderConfig.dividendMax - remainder) / divisor
    );

    // Ensure we have valid quotient range
    if (minQuotient > maxQuotient) {
      continue;
    }

    const quotient = rng.nextInt(minQuotient, maxQuotient);
    const dividend = divisor * quotient + remainder;

    // Verify the result
    if (
      dividend >= divisionWithRemainderConfig.dividendMin &&
      dividend <= divisionWithRemainderConfig.dividendMax &&
      dividend % divisor === remainder &&
      remainder > 0 &&
      remainder < divisor
    ) {
      problems.push({
        id: `div-rest-${problems.length}`,
        type: 'divisionWithRemainder',
        dividend,
        divisor,
        quotient,
        remainder,
      });
    }
  }

  return problems;
}
