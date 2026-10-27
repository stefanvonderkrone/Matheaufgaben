import { SeededRandom } from './random_generator';
import type { RoundingRangeProblem, RoundingToPlaceProblem } from '../config/problem_types';
import { roundingConfig } from '../config/math_config';

const ROUND_PLACES = [10, 100, 1000] as const;
const RANGE_PLACES = [10, 100] as const;

function roundTo(value: number, place: number): number {
  return Math.round(value / place) * place;
}

function maxRoundableValue(place: number): number {
  const firstValueThatRoundsTo10000 = 10000 - place / 2;
  return Math.min(roundingConfig.valueMax, firstValueThatRoundsTo10000 - 1);
}

function generateRoundProblem(
  rng: SeededRandom,
  id: string,
  place: 10 | 100 | 1000,
): RoundingToPlaceProblem {
  const maxValue = maxRoundableValue(place);
  let value = rng.nextInt(roundingConfig.valueMin, maxValue);

  while (value % place === 0 || roundTo(value, place) === 10000) {
    value = rng.nextInt(roundingConfig.valueMin, maxValue);
  }

  return {
    id,
    type: 'rounding',
    kind: 'round',
    place,
    value,
    result: roundTo(value, place),
  };
}

function generateRangeProblem(
  rng: SeededRandom,
  id: string,
  place: 10 | 100,
): RoundingRangeProblem {
  const minMultiple = Math.ceil(roundingConfig.roundedMin / place);
  const maxMultiple = Math.floor(roundingConfig.roundedMax / place);
  const rounded = rng.nextInt(minMultiple, maxMultiple) * place;
  const half = place / 2;

  return {
    id,
    type: 'rounding',
    kind: 'range',
    place,
    rounded,
    minExact: rounded - half,
    maxExact: rounded + half - 1,
  };
}

function shuffle<T>(rng: SeededRandom, items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = rng.nextInt(0, i);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function generateRoundingProblems(seed: number): {
  roundProblems: RoundingToPlaceProblem[];
  rangeProblems: RoundingRangeProblem[];
} {
  const rng = new SeededRandom(seed);
  const count = roundingConfig.problemsPerBlock;

  const roundPlaces = shuffle(
    rng,
    Array.from({ length: count }, (_, index) => ROUND_PLACES[index % ROUND_PLACES.length]),
  );
  const rangePlaces = shuffle(
    rng,
    Array.from({ length: count }, (_, index) => RANGE_PLACES[index % RANGE_PLACES.length]),
  );

  const roundProblems = roundPlaces.map((place, index) =>
    generateRoundProblem(rng, `round-${index}`, place),
  );
  const rangeProblems = rangePlaces.map((place, index) =>
    generateRangeProblem(rng, `range-${index}`, place),
  );

  return { roundProblems, rangeProblems };
}
