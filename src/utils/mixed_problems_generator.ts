import { SeededRandom } from './random_generator';
import type { DivisionProblem, DivisionWithRemainderProblem, MultiplicationProblem } from '../config/problem_types';
import { divisionConfig, divisionWithRemainderConfig, multiplicationConfig } from '../config/math_config';

export type MixedProblem = 
  | DivisionProblem 
  | DivisionWithRemainderProblem 
  | MultiplicationProblem;

export interface MixedProblemsSet {
  problems: MixedProblem[];
}

export function generateMixedProblems(seed: number): MixedProblemsSet {
  const rng = new SeededRandom(seed);
  
  const divisionProblems: DivisionProblem[] = [];
  const divisionRestProblems: DivisionWithRemainderProblem[] = [];
  const multiplicationProblems: MultiplicationProblem[] = [];
  
  // Generate 4 Division problems (exact division, no remainder)
  let attempts = 0;
  const maxAttempts = 4 * 100;
  
  while (divisionProblems.length < 4 && attempts < maxAttempts) {
    attempts++;
    
    const divisor = rng.nextInt(divisionConfig.divisorMin, divisionConfig.divisorMax);
    const minQuotient = Math.ceil(divisionConfig.dividendMin / divisor);
    const maxQuotient = Math.floor(divisionConfig.dividendMax / divisor);
    const quotient = rng.nextInt(minQuotient, maxQuotient);
    const dividend = divisor * quotient;
    
    if (dividend % divisor === 0 && 
        dividend >= divisionConfig.dividendMin && 
        dividend <= divisionConfig.dividendMax) {
      divisionProblems.push({
        id: `div-${divisionProblems.length}`,
        type: 'division',
        dividend,
        divisor,
        quotient,
      });
    }
  }
  
  // Generate 4 Division with Remainder problems
  attempts = 0;
  while (divisionRestProblems.length < 4 && attempts < maxAttempts) {
    attempts++;
    
    const divisor = rng.nextInt(
      divisionWithRemainderConfig.divisorMin,
      divisionWithRemainderConfig.divisorMax
    );
    const remainder = rng.nextInt(1, divisor - 1);
    
    const minQuotient = Math.ceil(
      (divisionWithRemainderConfig.dividendMin - remainder) / divisor
    );
    const maxQuotient = Math.floor(
      (divisionWithRemainderConfig.dividendMax - remainder) / divisor
    );
    
    if (minQuotient > maxQuotient) continue;
    
    const quotient = rng.nextInt(minQuotient, maxQuotient);
    const dividend = divisor * quotient + remainder;
    
    if (
      dividend >= divisionWithRemainderConfig.dividendMin &&
      dividend <= divisionWithRemainderConfig.dividendMax &&
      dividend % divisor === remainder &&
      remainder > 0 &&
      remainder < divisor
    ) {
      divisionRestProblems.push({
        id: `div-rest-${divisionRestProblems.length}`,
        type: 'divisionWithRemainder',
        dividend,
        divisor,
        quotient,
        remainder,
      });
    }
  }
  
  // Generate 4 Multiplication problems
  while (multiplicationProblems.length < 4) {
    const factor1 = rng.nextInt(
      multiplicationConfig.factor1Min,
      multiplicationConfig.factor1Max
    );
    const factor2 = rng.nextInt(
      multiplicationConfig.factor2Min,
      multiplicationConfig.factor2Max
    );
    
    multiplicationProblems.push({
      id: `mult-${multiplicationProblems.length}`,
      type: 'multiplication',
      factor1,
      factor2,
      product: factor1 * factor2,
    });
  }
  
  // Combine all problems
  const allProblems: MixedProblem[] = [
    ...divisionProblems,
    ...divisionRestProblems,
    ...multiplicationProblems,
  ];
  
  // Shuffle using Fisher-Yates algorithm with the same RNG
  for (let i = allProblems.length - 1; i > 0; i--) {
    const j = rng.nextInt(0, i);
    [allProblems[i], allProblems[j]] = [allProblems[j], allProblems[i]];
  }
  
  // Reassign IDs after shuffling to maintain order
  allProblems.forEach((problem, index) => {
    problem.id = `mixed-${index}`;
  });
  
  return { problems: allProblems };
}
