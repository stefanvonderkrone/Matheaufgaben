# Matheaufgaben verification map

This directory is the maintained source for the user-facing behavior of Matheaufgaben. Read this index first. Then use the feature file as the recipe.

## Baseline preconditions

- Launch Matheaufgaben with `drive.mjs launch` from the repo root.
- The base URL is `http://127.0.0.1:5199` unless `VERIFY_PORT` is set.
- The app has no login and no stored worksheets. The URL seed is the fixture.
- Run `drive.mjs doctor` and require `ok`, the expected URL, and the recorded git revision.
- Drive only the instance that this launch started.
- Run one verification instance. The state file holds one pair of process ids.

## Driving conventions

- Start every recipe from a healthy doctor result.
- Prefer the accessibility role and the exact accessible name.
- Treat every command as literal. Keep the quotes and the flags.
- Quote paths that contain `?`.
- Run browser actions through `node .agents/skills/verify-matheaufgaben/scripts/drive.mjs`.
- After a click or a fill, wait for page text or read the URL.
- Keep proof files. Cleanup removes only `artifacts/verify-matheaufgaben/run`.

## Proof and skip reporting

- Capture the user action and the resulting page text.
- UI proof includes an accessibility snapshot and a viewport screenshot.
- The snapshot title is `matheaufgaben`.
- Seed proof includes a second load of the same URL. The two text files must match.
- A different seed must change the problem digits.
- Record the feature id and the entry point in the evidence directory name.
- Report a blocked path with the command and the missing precondition.
- Do not report a skipped entry point as verified through another path.

## Feature entry contract

Each feature file starts with an H1 and one paragraph. It then uses these four H2 sections in order.

1. `Sub-features` lists short ids and one line for each behavior.
2. `How to get to it (user POV)` lists every user entry point.
3. `Driving it with drive.mjs` starts with `Preconditions:` and pairs each action with a command and a result.
4. `Gotchas` lists traps that can spoil a run.

## Features

- [Overview](./overview.md) covers the grade list and opening a worksheet from a link.
- [Division seed](./division-seed.md) covers the same division worksheet for seed `12345` on two loads.
- [Manual seed](./manual-seed.md) covers typing a seed and choosing Go.
- [New worksheet](./new-worksheet.md) covers a new random seed and the return to the overview.
- [Addition and subtraction](./addition-subtraction.md) covers the German controls and seed `42`.

## Not mapped yet

These routes are live and are not covered by a feature file. Do not mark them verified.

- `/schriftliche-division-mit-rest` and `/multiplication` use the English controls from the division page.
- `/sammelaufgaben`, `/ueberschlag`, `/zahlenstrahl-1`, `/rechenregeln-1`, `/sachaufgaben-1`, `/runden-1`, and `/potenzen-1` use the German controls from the addition page.
