export interface MathProblem {
  id: string;
  type: 'division' | 'addition' | 'multiplication' | 'divisionWithRemainder' | 'estimate' | 'additionSubtraction' | 'numberLine' | 'calculationRules' | 'storyProblem' | 'rounding' | 'powers';
}

export interface DivisionProblem extends MathProblem {
  type: 'division';
  dividend: number;
  divisor: number;
  quotient: number;
}

export interface DivisionWithRemainderProblem extends MathProblem {
  type: 'divisionWithRemainder';
  dividend: number;
  divisor: number;
  quotient: number;
  remainder: number;
}

export interface AdditionProblem extends MathProblem {
  type: 'addition';
  addend1: number;
  addend2: number;
  sum: number;
}

export interface MultiplicationProblem extends MathProblem {
  type: 'multiplication';
  factor1: number;
  factor2: number;
  product: number;
}

export interface AdditionSubtractionProblem extends MathProblem {
  type: 'additionSubtraction';
  operation: 'addition' | 'subtraction';
  operand1: number;
  operand2: number;
  result: number;
}

export interface NumberLineProblem extends MathProblem {
  type: 'numberLine';
  start: number;
  end: number;
}

export interface CalculationRulesProblem extends MathProblem {
  type: 'calculationRules';
  expression: string;
  result: number;
}

export interface StoryProblem extends MathProblem {
  type: 'storyProblem';
  prompt: string;
  parts: Array<{ label: string; text: string }>;
}

export interface RoundingToPlaceProblem extends MathProblem {
  type: 'rounding';
  kind: 'round';
  place: 10 | 100 | 1000;
  value: number;
  result: number;
}

export interface RoundingRangeProblem extends MathProblem {
  type: 'rounding';
  kind: 'range';
  place: 10 | 100;
  rounded: number;
  minExact: number;
  maxExact: number;
}

export type RoundingProblem = RoundingToPlaceProblem | RoundingRangeProblem;

export interface ProductAsPowerProblem extends MathProblem {
  type: 'powers';
  kind: 'product';
  base: number;
  exponent: number;
}

export interface EvaluatePowerProblem extends MathProblem {
  type: 'powers';
  kind: 'evaluate';
  base: number;
  exponent: number;
  value: number;
}

export interface TenPowerProblem extends MathProblem {
  type: 'powers';
  kind: 'ten';
  exponent: number;
  value: number;
}

export type PowersProblem = ProductAsPowerProblem | EvaluatePowerProblem | TenPowerProblem;

export interface EstimateProblem extends MathProblem {
  type: 'estimate';
  operation: 'addition' | 'subtraction' | 'multiplication';
  operand1: number;
  operand2: number;
  rounded1: number;
  rounded2: number;
  estimateResult: number;
  exactResult: number;
}
