import { SeededRandom } from './random_generator';
import type { CalculationRulesProblem } from '../config/problem_types';
import { calculationRulesConfig } from '../config/math_config';

type Op = '+' | '-' | '*';

type Expr =
  | { kind: 'num'; value: number }
  | { kind: 'paren'; inner: Expr }
  | { kind: 'bin'; op: Op; left: Expr; right: Expr };

function num(value: number): Expr {
  return { kind: 'num', value };
}

function paren(inner: Expr): Expr {
  return { kind: 'paren', inner };
}

function bin(op: Op, left: Expr, right: Expr): Expr {
  return { kind: 'bin', op, left, right };
}

function addend(rng: SeededRandom): number {
  return rng.nextInt(calculationRulesConfig.addendMin, calculationRulesConfig.addendMax);
}

function factor(rng: SeededRandom): number {
  return rng.nextInt(calculationRulesConfig.factorMin, calculationRulesConfig.factorMax);
}

function greaterThan(rng: SeededRandom, value: number, extraMax = 600): number {
  return value + rng.nextInt(1, extraMax);
}

function evalExpr(expr: Expr): number {
  switch (expr.kind) {
    case 'num':
      return expr.value;
    case 'paren':
      return evalExpr(expr.inner);
    case 'bin': {
      const left = evalExpr(expr.left);
      const right = evalExpr(expr.right);
      if (expr.op === '+') {
        return left + right;
      }
      if (expr.op === '*') {
        return left * right;
      }
      if (left <= right) {
        throw new Error('Subtraktion würde nicht positiv bleiben');
      }
      return left - right;
    }
  }
}

function formatExpr(expr: Expr): string {
  switch (expr.kind) {
    case 'num':
      return String(expr.value);
    case 'paren':
      return `(${formatExpr(expr.inner)})`;
    case 'bin': {
      const operator = expr.op === '*' ? '·' : expr.op;
      return `${formatExpr(expr.left)} ${operator} ${formatExpr(expr.right)}`;
    }
  }
}

function subtract(minuend: Expr, subtrahend: Expr): Expr {
  if (evalExpr(minuend) <= evalExpr(subtrahend)) {
    throw new Error('Minuend ist nicht größer als Subtrahend');
  }
  return bin('-', minuend, subtrahend);
}

function numberLessThan(rng: SeededRandom, limit: number): number {
  const max = Math.min(calculationRulesConfig.addendMax, limit - 1);
  if (max < calculationRulesConfig.addendMin) {
    throw new Error('Kein gültiger Subtrahend möglich');
  }
  return rng.nextInt(calculationRulesConfig.addendMin, max);
}

function parenAdd(rng: SeededRandom): Expr {
  return paren(bin('+', num(addend(rng)), num(addend(rng))));
}

function parenSub(rng: SeededRandom): Expr {
  const subtrahend = addend(rng);
  const minuend = greaterThan(rng, subtrahend);
  return paren(subtract(num(minuend), num(subtrahend)));
}

function parenMul(rng: SeededRandom): Expr {
  return paren(bin('*', num(factor(rng)), num(factor(rng))));
}

function parenAddLessThan(rng: SeededRandom, limit: number): Expr {
  const minPair = calculationRulesConfig.addendMin * 2;
  if (limit <= minPair) {
    throw new Error('Geklammerte Summe passt nicht unter das Limit');
  }

  const firstMax = Math.min(
    calculationRulesConfig.addendMax,
    limit - 1 - calculationRulesConfig.addendMin,
  );
  const first = rng.nextInt(calculationRulesConfig.addendMin, firstMax);
  const second = numberLessThan(rng, limit - first);
  return paren(bin('+', num(first), num(second)));
}

function parenMulLessThan(rng: SeededRandom, limit: number): Expr {
  for (let i = 0; i < 40; i++) {
    const a = factor(rng);
    const b = factor(rng);
    if (a * b < limit) {
      return paren(bin('*', num(a), num(b)));
    }
  }
  throw new Error('Geklammertes Produkt passt nicht unter das Limit');
}

function parenSubLessThan(rng: SeededRandom, limit: number): Expr {
  const innerSubtrahend = addend(rng);
  const innerMinuendMax = Math.min(
    calculationRulesConfig.addendMax + 600,
    innerSubtrahend + limit - 2,
  );
  if (innerMinuendMax <= innerSubtrahend) {
    throw new Error('Geklammerte Differenz passt nicht unter das Limit');
  }
  const innerMinuend = rng.nextInt(innerSubtrahend + 1, innerMinuendMax);
  const expr = paren(subtract(num(innerMinuend), num(innerSubtrahend)));
  if (evalExpr(expr) >= limit) {
    throw new Error('Geklammerte Differenz ist zu groß');
  }
  return expr;
}

function randomParen(rng: SeededRandom): Expr {
  const choice = rng.nextInt(0, 2);
  if (choice === 0) {
    return parenAdd(rng);
  }
  if (choice === 1) {
    return parenMul(rng);
  }
  return parenSub(rng);
}

function randomParenLessThan(rng: SeededRandom, limit: number): Expr {
  const choice = rng.nextInt(0, 2);
  if (choice === 0) {
    return parenAddLessThan(rng, limit);
  }
  if (choice === 1) {
    return parenMulLessThan(rng, limit);
  }
  return parenSubLessThan(rng, limit);
}

const templates: Array<(rng: SeededRandom) => Expr> = [
  (rng) => bin('+', parenAdd(rng), num(addend(rng))),
  (rng) => bin('+', bin('+', parenAdd(rng), num(addend(rng))), num(addend(rng))),
  (rng) =>
    bin(
      '+',
      bin('+', bin('+', parenAdd(rng), num(addend(rng))), num(addend(rng))),
      num(addend(rng)),
    ),

  // a - (b + c)
  (rng) => {
    const inner = parenAdd(rng);
    return subtract(num(greaterThan(rng, evalExpr(inner))), inner);
  },

  // a - (b * c)
  (rng) => {
    const inner = parenMul(rng);
    return subtract(num(greaterThan(rng, evalExpr(inner), 400)), inner);
  },

  (rng) => bin('+', num(addend(rng)), bin('*', num(factor(rng)), num(factor(rng)))),
  (rng) => bin('+', bin('*', num(factor(rng)), num(factor(rng))), num(addend(rng))),
  (rng) =>
    bin(
      '+',
      bin('+', bin('*', num(factor(rng)), num(factor(rng))), num(addend(rng))),
      num(addend(rng)),
    ),
  (rng) =>
    bin(
      '+',
      bin('+', num(addend(rng)), bin('*', num(factor(rng)), num(factor(rng)))),
      num(addend(rng)),
    ),

  (rng) => bin('+', parenSub(rng), num(addend(rng))),
  (rng) => bin('+', num(addend(rng)), parenSub(rng)),

  // a + b - c
  (rng) => {
    const a = addend(rng);
    const b = addend(rng);
    return subtract(bin('+', num(a), num(b)), num(numberLessThan(rng, a + b)));
  },

  // a - b + c
  (rng) => {
    const b = addend(rng);
    return bin('+', subtract(num(greaterThan(rng, b)), num(b)), num(addend(rng)));
  },

  (rng) => bin('+', num(addend(rng)), parenAdd(rng)),

  // (a + b) - c
  (rng) => {
    const inner = parenAdd(rng);
    return subtract(inner, num(numberLessThan(rng, evalExpr(inner))));
  },

  // (a - b) - c
  (rng) => {
    const inner = parenSub(rng);
    return subtract(inner, num(numberLessThan(rng, evalExpr(inner))));
  },

  // (a * b) - c
  (rng) => {
    const inner = parenMul(rng);
    return subtract(inner, num(numberLessThan(rng, evalExpr(inner))));
  },

  // (a □ b) - (c □ d)
  (rng) => {
    const minuend = randomParen(rng);
    return subtract(minuend, randomParenLessThan(rng, evalExpr(minuend)));
  },
];

export function generateCalculationRulesProblems(seed: number): CalculationRulesProblem[] {
  const rng = new SeededRandom(seed);
  const problems: CalculationRulesProblem[] = [];
  const maxAttempts = 200;

  while (problems.length < calculationRulesConfig.problemsPerPage) {
    let attempts = 0;
    let created: CalculationRulesProblem | null = null;

    while (attempts < maxAttempts && created === null) {
      attempts += 1;
      const template = templates[rng.nextInt(0, templates.length - 1)];
      try {
        const expr = template(rng);
        const result = evalExpr(expr);
        created = {
          id: `rules-${problems.length}`,
          type: 'calculationRules',
          expression: formatExpr(expr),
          result,
        };
      } catch {
        // Ungültige Werte: neue Zahlen ziehen
      }
    }

    if (created === null) {
      throw new Error('Konnte keine gültige Rechenregeln-Aufgabe erzeugen');
    }

    problems.push(created);
  }

  return problems;
}
