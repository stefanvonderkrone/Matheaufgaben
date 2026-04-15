import { SeededRandom } from './random_generator';
import type { EstimateProblem } from '../config/problem_types';
import { estimateConfig } from '../config/math_config';

function roundToHundreds(num: number): number {
  return Math.round(num / 100) * 100;
}

function generateAdditionProblem(rng: SeededRandom, id: string): EstimateProblem {
  const addend1 = rng.nextInt(estimateConfig.minValue, estimateConfig.maxValue);
  const addend2 = rng.nextInt(estimateConfig.minValue, estimateConfig.maxValue);
  
  const rounded1 = roundToHundreds(addend1);
  const rounded2 = roundToHundreds(addend2);
  
  return {
    id,
    type: 'estimate',
    operation: 'addition',
    operand1: addend1,
    operand2: addend2,
    rounded1,
    rounded2,
    estimateResult: rounded1 + rounded2,
    exactResult: addend1 + addend2,
  };
}

function generateSubtractionProblem(rng: SeededRandom, id: string): EstimateProblem {
  let minuend = rng.nextInt(estimateConfig.minValue, estimateConfig.maxValue);
  let subtrahend = rng.nextInt(estimateConfig.minValue, estimateConfig.maxValue);
  
  let roundedMinuend = roundToHundreds(minuend);
  let roundedSubtrahend = roundToHundreds(subtrahend);
  
  // Ensure both exact and estimated results are positive
  // minuend > subtrahend (for exact result)
  // AND roundedMinuend > roundedSubtrahend (for estimated result)
  while (minuend <= subtrahend || roundedMinuend <= roundedSubtrahend) {
    minuend = rng.nextInt(estimateConfig.minValue, estimateConfig.maxValue);
    subtrahend = rng.nextInt(estimateConfig.minValue, estimateConfig.maxValue);
    roundedMinuend = roundToHundreds(minuend);
    roundedSubtrahend = roundToHundreds(subtrahend);
  }
  
  return {
    id,
    type: 'estimate',
    operation: 'subtraction',
    operand1: minuend,
    operand2: subtrahend,
    rounded1: roundedMinuend,
    rounded2: roundedSubtrahend,
    estimateResult: roundedMinuend - roundedSubtrahend,
    exactResult: minuend - subtrahend,
  };
}

function generateMultiplicationProblem(rng: SeededRandom, id: string): EstimateProblem {
  const factor = rng.nextInt(estimateConfig.minValue, estimateConfig.maxValue);
  const multiplier = rng.nextInt(estimateConfig.multiplierMin, estimateConfig.multiplierMax);
  
  const roundedFactor = roundToHundreds(factor);
  
  return {
    id,
    type: 'estimate',
    operation: 'multiplication',
    operand1: factor,
    operand2: multiplier,
    rounded1: roundedFactor,
    rounded2: multiplier, // Multiplier stays as is (not rounded for single digit)
    estimateResult: roundedFactor * multiplier,
    exactResult: factor * multiplier,
  };
}

export function generateEstimateProblems(seed: number): EstimateProblem[] {
  const rng = new SeededRandom(seed);
  const problems: EstimateProblem[] = [];
  
  // Generate 4 addition problems
  for (let i = 0; i < estimateConfig.problemsPerType; i++) {
    problems.push(generateAdditionProblem(rng, `est-add-${i}`));
  }
  
  // Generate 4 subtraction problems
  for (let i = 0; i < estimateConfig.problemsPerType; i++) {
    problems.push(generateSubtractionProblem(rng, `est-sub-${i}`));
  }
  
  // Generate 4 multiplication problems
  for (let i = 0; i < estimateConfig.problemsPerType; i++) {
    problems.push(generateMultiplicationProblem(rng, `est-mul-${i}`));
  }
  
  // Shuffle the problems
  for (let i = problems.length - 1; i > 0; i--) {
    const j = rng.nextInt(0, i);
    [problems[i], problems[j]] = [problems[j], problems[i]];
  }
  
  return problems;
}
