export interface MathConfig {
  problemsPerPage: number;
}

export const defaultConfig: MathConfig = {
  problemsPerPage: 12,
};

export const divisionConfig = {
  dividendMin: 100,
  dividendMax: 9999,
  divisorMin: 2,
  divisorMax: 9,
};

export const divisionWithRemainderConfig = {
  dividendMin: 1000,
  dividendMax: 999999,
  divisorMin: 2,
  divisorMax: 9,
  problemsPerPage: 6,
};

export const multiplicationConfig = {
  factor1Min: 100,
  factor1Max: 9999,
  factor2Min: 2,
  factor2Max: 9,
  problemsPerPage: 12,
};

export const additionSubtractionConfig = {
  minValue: 10,
  maxValue: 999,
  problemsPerPage: 10,
};

export const numberLineConfig = {
  minValue: 1,
  maxValue: 100,
  problemsPerPage: 10,
};

export const calculationRulesConfig = {
  addendMin: 12,
  addendMax: 999,
  factorMin: 2,
  factorMax: 80,
  problemsPerPage: 10,
};

export const storyProblemsConfig = {
  problemsPerPage: 5,
};

export const estimateConfig = {
  minValue: 1000,
  maxValue: 9999,
  multiplierMin: 2,
  multiplierMax: 9,
  problemsPerPage: 12,
  problemsPerType: 4, // 4 Addition, 4 Subtraktion, 4 Multiplikation
};
