export interface MathProblem {
  id: string;
  type: 'division' | 'addition' | 'multiplication';
}

export interface DivisionProblem extends MathProblem {
  type: 'division';
  dividend: number;
  divisor: number;
  quotient: number;
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
