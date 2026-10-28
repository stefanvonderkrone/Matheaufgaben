# Manual seed

Manual seed lets a user type a seed and open that division worksheet with Go.

## Sub-features

- `manual-fill` replaces the prefilled seed with `42`.
- `manual-go` opens `/division?seed=42` from the Go button.
- `manual-problems` shows the seed `42` problems.

## How to get to it (user POV)

- Open `/division?seed=12345`.
- Replace the seed box with `42`.
- Choose `Go`.

## Driving it with drive.mjs

Preconditions:

- Doctor prints `ok` for `http://127.0.0.1:5199`.
- The page is the division worksheet. Its seed box placeholder is `Enter seed...`.

- **Open a known seed.** Load seed `12345`. Run `node .agents/skills/verify-matheaufgaben/scripts/drive.mjs goto '/division?seed=12345' --text 'Seed: 12345'`. The seed box shows `12345`.
- **Replace the seed.** Type `42`. Run `node .agents/skills/verify-matheaufgaben/scripts/drive.mjs fill --placeholder 'Enter seed...' --value 42`. Stdout is `Enter seed...=42`. The URL is still seed `12345` before Go.
- **Choose Go.** Run `node .agents/skills/verify-matheaufgaben/scripts/drive.mjs click --role button --name Go` and `node .agents/skills/verify-matheaufgaben/scripts/drive.mjs wait-text 'Seed: 42'`. The URL is `http://127.0.0.1:5199/division?seed=42`.
- **Save the result.** Run `node .agents/skills/verify-matheaufgaben/scripts/drive.mjs text > artifacts/verify-matheaufgaben/evidence/manual-seed/seed-42.txt` and `node .agents/skills/verify-matheaufgaben/scripts/drive.mjs screenshot --path artifacts/verify-matheaufgaben/evidence/manual-seed/page.png`. The text contains `Seed: 42`, the share URL for seed `42`, and the first problem lines `4`, `5`, `3`, `6`. It does not contain the first problem lines of seed `12345`, which are `3`, `1`, `4`, `1`, `÷`, `9`.

## Gotchas

- The seed box is prefilled. Fill selects that value and replaces it. A keystroke that only appends builds a different number.
- The control role is `spinbutton`. The fill command uses the placeholder `Enter seed...`.
- A value that the number input rejects makes `fill` fail. Do not continue after that failure.
- Go is the button proof. Enter in the box also submits, and this recipe does not use Enter.
- An unchanged `Seed:` line means Go did not open the typed seed.
