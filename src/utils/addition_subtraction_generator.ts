import { SeededRandom } from './random_generator';
import type { AdditionSubtractionProblem } from '../config/problem_types';
import { additionSubtractionConfig } from '../config/math_config';

function randomTwoOrThreeDigit(rng: SeededRandom): number {
  return rng.nextInt(additionSubtractionConfig.minValue, additionSubtractionConfig.maxValue);
}

function generateAddition(rng: SeededRandom, id: string): AdditionSubtractionProblem {
  const operand1 = randomTwoOrThreeDigit(rng);
  const operand2 = randomTwoOrThreeDigit(rng);

  return {
    id,
    type: 'additionSubtraction',
    operation: 'addition',
    operand1,
    operand2,
    result: operand1 + operand2,
  };
}

function generateSubtraction(rng: SeededRandom, id: string): AdditionSubtractionProblem {
  let operand1 = randomTwoOrThreeDigit(rng);
  let operand2 = randomTwoOrThreeDigit(rng);

  while (operand1 < operand2) {
    operand1 = randomTwoOrThreeDigit(rng);
    operand2 = randomTwoOrThreeDigit(rng);
  }

  return {
    id,
    type: 'additionSubtraction',
    operation: 'subtraction',
    operand1,
    operand2,
    result: operand1 - operand2,
  };
}

export function generateAdditionSubtractionProblems(seed: number): AdditionSubtractionProblem[] {
  const rng = new SeededRandom(seed);
  const problems: AdditionSubtractionProblem[] = [];
  const half = additionSubtractionConfig.problemsPerPage / 2;

  for (let i = 0; i < half; i++) {
    problems.push(generateAddition(rng, `add-${i}`));
  }

  for (let i = 0; i < half; i++) {
    problems.push(generateSubtraction(rng, `sub-${i}`));
  }

  for (let i = problems.length - 1; i > 0; i--) {
    const j = rng.nextInt(0, i);
    [problems[i], problems[j]] = [problems[j], problems[i]];
  }

  return problems;
}
