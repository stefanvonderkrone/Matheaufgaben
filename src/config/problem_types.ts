export interface MathProblem {
  id: string;
  type: 'division' | 'addition' | 'multiplication' | 'divisionWithRemainder' | 'estimate';
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
