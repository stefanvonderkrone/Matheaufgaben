import { SeededRandom } from './random_generator';
import type { StoryProblem } from '../config/problem_types';
import { storyProblemsConfig } from '../config/math_config';

const NUMBER_WORDS: Record<number, string> = {
  2: 'zwei',
  3: 'drei',
  4: 'vier',
  5: 'fünf',
  6: 'sechs',
  7: 'sieben',
  8: 'acht',
  9: 'neun',
  10: 'zehn',
  11: 'elf',
  12: 'zwölf',
};

const PART_ADJECTIVES: Record<number, string> = {
  2: 'zweiteiliger',
  3: 'dreiteiliger',
  4: 'vierteiliger',
  5: 'fünfteiliger',
  6: 'sechsteiliger',
  7: 'siebenteiliger',
  8: 'achtteiliger',
  9: 'neunteiliger',
};

const CITIES = [
  'Leipziger',
  'Berliner',
  'Dresdner',
  'Magdeburger',
  'Chemnitzer',
  'Erfurter',
  'Rostocker',
  'Potsdamer',
];

const ROUNDING_VEHICLES = ['Boot', 'Schiff', 'Flugzeug', 'Bus'] as const;

const FOODS = [
  { name: 'Schokoriegel', article: 'Ein', plural: 'Schokoriegel' },
  { name: 'Banane', article: 'Eine', plural: 'Bananen' },
  { name: 'Apfel', article: 'Ein', plural: 'Äpfel' },
  { name: 'Joghurt', article: 'Ein', plural: 'Joghurts' },
  { name: 'Pudding', article: 'Ein', plural: 'Puddings' },
] as const;

const PEOPLE = [
  { name: 'Emilia', pronoun: 'sie' },
  { name: 'Mia', pronoun: 'sie' },
  { name: 'Lea', pronoun: 'sie' },
  { name: 'Sophie', pronoun: 'sie' },
  { name: 'Jonas', pronoun: 'er' },
  { name: 'Leon', pronoun: 'er' },
  { name: 'Ben', pronoun: 'er' },
  { name: 'Noah', pronoun: 'er' },
] as const;

function pick<T>(rng: SeededRandom, items: readonly T[]): T {
  return items[rng.nextInt(0, items.length - 1)];
}

function generateRouteProblem(rng: SeededRandom, id: string): StoryProblem {
  const city = pick(rng, CITIES);
  const lineKm = rng.nextInt(8, 35);
  const trips = rng.nextInt(2, 12);
  const depotKm = rng.nextInt(3, 15);
  const tripsWord = NUMBER_WORDS[trips];

  return {
    id,
    type: 'storyProblem',
    prompt: `Ein Bus der ${city} Verkehrsbetriebe fährt eine Linie, die eine Länge von ${lineKm} km hat. Der Bus fährt diese Linie ${tripsWord} Mal. Davor und danach fährt dieser ${depotKm} km zum Betriebshof.`,
    parts: [
      { label: 'a', text: 'Gib die gegebenen Werte an.' },
      { label: 'b', text: 'Bestimme die Länge, die der Bus insgesamt gefahren ist.' },
      { label: 'c', text: 'Formuliere einen Antwortsatz' },
    ],
  };
}

function generateRoundingProblem(rng: SeededRandom, id: string): StoryProblem {
  const roundedSeats = rng.nextInt(8, 89) * 10;
  const useIce = rng.next() < 0.5;

  let prompt: string;
  if (useIce) {
    const parts = rng.nextInt(2, 9);
    prompt = `Ein ${PART_ADJECTIVES[parts]} ICE 4 hat gerundet ${roundedSeats} Sitzplätze (gerundet auf Zehner). Bestimme den kleinsten und den größten exakten Wert für die Anzahl der Sitzplätze.`;
  } else {
    const vehicle = pick(rng, ROUNDING_VEHICLES);
    prompt = `Ein ${vehicle} hat gerundet ${roundedSeats} Sitzplätze (gerundet auf Zehner). Bestimme den kleinsten und den größten exakten Wert für die Anzahl der Sitzplätze.`;
  }

  return {
    id,
    type: 'storyProblem',
    prompt,
    parts: [],
  };
}

function generateCaloriesProblem(rng: SeededRandom, id: string): StoryProblem {
  const food = pick(rng, FOODS);
  const person = pick(rng, PEOPLE);
  const itemKcal = rng.nextInt(2, 28) * 10;
  const count = rng.nextInt(5, 12);
  const dailyKcal = itemKcal * count;

  return {
    id,
    type: 'storyProblem',
    prompt: `${food.article} ${food.name} hat ${itemKcal} kcal. ${person.name} möchte pro Tag ${dailyKcal}kcal essen. Berechne die Anzahl ${food.plural}, die ${person.pronoun} pro Tag essen könnte.`,
    parts: [],
  };
}

export function generateStoryProblems(seed: number): StoryProblem[] {
  const rng = new SeededRandom(seed);
  const builders = [
    generateRouteProblem,
    generateRouteProblem,
    generateRoundingProblem,
    generateRoundingProblem,
    generateCaloriesProblem,
  ];

  for (let i = builders.length - 1; i > 0; i--) {
    const j = rng.nextInt(0, i);
    [builders[i], builders[j]] = [builders[j], builders[i]];
  }

  return builders
    .slice(0, storyProblemsConfig.problemsPerPage)
    .map((build, index) => build(rng, `story-${index}`));
}
