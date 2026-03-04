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
