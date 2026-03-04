import { SeededRandom } from './random_generator';
import type { DivisionProblem } from '../config/problem_types';
import { divisionConfig } from '../config/math_config';

export function generateDivisionProblems(
  count: number,
  seed: number
): DivisionProblem[] {
  const rng = new SeededRandom(seed);
  const problems: DivisionProblem[] = [];
  
  let attempts = 0;
  const maxAttempts = count * 100; // Prevent infinite loop
  
  while (problems.length < count && attempts < maxAttempts) {
    attempts++;
    
    // Generate divisor (1-digit)
    const divisor = rng.nextInt(divisionConfig.divisorMin, divisionConfig.divisorMax);
    
    // Generate quotient (so that dividend is 3-4 digits)
    // dividend = divisor * quotient
    // We need: 100 <= dividend <= 9999
    // So: 100/divisor <= quotient <= 9999/divisor
    const minQuotient = Math.ceil(divisionConfig.dividendMin / divisor);
    const maxQuotient = Math.floor(divisionConfig.dividendMax / divisor);
    
    const quotient = rng.nextInt(minQuotient, maxQuotient);
    const dividend = divisor * quotient;
    
    // Verify the result
    if (dividend % divisor === 0 && 
        dividend >= divisionConfig.dividendMin && 
        dividend <= divisionConfig.dividendMax) {
      
      problems.push({
        id: `div-${problems.length}`,
        type: 'division',
        dividend,
        divisor,
        quotient,
      });
    }
  }
  
  return problems;
}
