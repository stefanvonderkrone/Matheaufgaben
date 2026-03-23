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
