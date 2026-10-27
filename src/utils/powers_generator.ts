import { SeededRandom } from './random_generator';
import type {
  EvaluatePowerProblem,
  ProductAsPowerProblem,
  TenPowerProblem,
} from '../config/problem_types';
import { powersConfig } from '../config/math_config';

function shuffle<T>(rng: SeededRandom, items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = rng.nextInt(0, i);
    const current = copy[i];
    copy[i] = copy[j];
    copy[j] = current;
  }
  return copy;
}

function powerKey(base: number, exponent: number): string {
  return `${base}-${exponent}`;
}

function generateTenProblems(rng: SeededRandom, used: Set<string>): TenPowerProblem[] {
  const pool: number[] = [];
  for (let exponent = powersConfig.tenExponentMin; exponent <= powersConfig.tenExponentMax; exponent++) {
    if (!used.has(powerKey(10, exponent))) {
      pool.push(exponent);
    }
  }

  if (pool.length < powersConfig.tenProblemCount) {
    throw new Error('Konnte keine eindeutige Zehnerpotenz erzeugen');
  }

  return shuffle(rng, pool)
    .slice(0, powersConfig.tenProblemCount)
    .map((exponent, index) => {
      used.add(powerKey(10, exponent));
      return {
        id: `powers-ten-${index}`,
        type: 'powers' as const,
        kind: 'ten' as const,
        exponent,
        value: 10 ** exponent,
      };
    });
}

function generateProductProblems(rng: SeededRandom, used: Set<string>): ProductAsPowerProblem[] {
  const ranges: Array<[number, number]> = [
    [1, 9],
    [1, 9],
    [10, 99],
    [10, 99],
    [10, 99],
    [100, 999],
    [100, 999],
    [100, 999],
  ];

  return shuffle(rng, ranges)
    .slice(0, powersConfig.productProblemCount)
    .map((range, index) => {
      for (let guard = 0; guard < 80; guard++) {
        const base = rng.nextInt(range[0], range[1]);
        const exponent = rng.nextInt(
          powersConfig.productExponentMin,
          powersConfig.productExponentMax,
        );
        const key = powerKey(base, exponent);
        if (used.has(key)) {
          continue;
        }

        used.add(key);
        return {
          id: `powers-product-${index}`,
          type: 'powers' as const,
          kind: 'product' as const,
          base,
          exponent,
        };
      }

      throw new Error('Konnte keine eindeutige Produkt-Aufgabe erzeugen');
    });
}

function generateEvaluateProblems(rng: SeededRandom, used: Set<string>): EvaluatePowerProblem[] {
  const problems: EvaluatePowerProblem[] = [];
  let guard = 0;

  while (problems.length < powersConfig.evaluateProblemCount) {
    guard += 1;
    if (guard > 500) {
      throw new Error('Konnte keine eindeutige Potenz-Aufgabe erzeugen');
    }

    const base = rng.nextInt(powersConfig.evaluateBaseMin, powersConfig.evaluateBaseMax);
    const exponent = rng.nextInt(
      powersConfig.evaluateExponentMin,
      powersConfig.evaluateExponentMax,
    );
    const key = powerKey(base, exponent);
    if (used.has(key)) {
      continue;
    }

    const value = base ** exponent;
    if (!Number.isSafeInteger(value) || value > powersConfig.evaluateValueMax) {
      continue;
    }

    used.add(key);
    problems.push({
      id: `powers-evaluate-${problems.length}`,
      type: 'powers',
      kind: 'evaluate',
      base,
      exponent,
      value,
    });
  }

  return problems;
}

export function generatePowersProblems(seed: number): {
  productProblems: ProductAsPowerProblem[];
  evaluateProblems: EvaluatePowerProblem[];
  tenProblems: TenPowerProblem[];
} {
  const rng = new SeededRandom(seed);
  const used = new Set<string>();

  return {
    tenProblems: generateTenProblems(rng, used),
    productProblems: generateProductProblems(rng, used),
    evaluateProblems: generateEvaluateProblems(rng, used),
  };
}
