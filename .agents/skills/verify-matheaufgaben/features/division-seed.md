# Division seed

Division seed opens Schriftliche Division for a seed in the URL. The same seed shows the same problems on a second load. A different seed shows different problems.

## Sub-features

- `division-open` shows seed `12345` and the heading `Schriftliche Division`.
- `division-problems` shows the twelve problems for that seed.
- `division-reload` shows the same page text after a second load.
- `division-other-seed` shows different digits for seed `42`.

## How to get to it (user POV)

- Open `/division?seed=12345`.
- Open `/division?seed=42` for the comparison load.
- A bare `/division` also uses seed `12345`. Use the explicit query in this recipe.

## Driving it with drive.mjs

Preconditions:

- Doctor prints `ok` for `http://127.0.0.1:5199`.
- The evidence directory is `artifacts/verify-matheaufgaben/evidence/division-seed`.

- **Create the evidence directory.** Run `mkdir -p artifacts/verify-matheaufgaben/evidence/division-seed`.
- **Record doctor.** Save the doctor result. Run `node .agents/skills/verify-matheaufgaben/scripts/drive.mjs doctor > artifacts/verify-matheaufgaben/evidence/division-seed/doctor.txt`. The file starts with `ok`.
- **Open seed 12345.** Load the worksheet. Run `node .agents/skills/verify-matheaufgaben/scripts/drive.mjs goto '/division?seed=12345' --text 'Seed: 12345'`. Stdout is `http://127.0.0.1:5199/division?seed=12345`.
- **Save the first view.** Save the page text, the snapshot, and the screenshot. Run `node .agents/skills/verify-matheaufgaben/scripts/drive.mjs text > artifacts/verify-matheaufgaben/evidence/division-seed/load-a.txt`, then the snapshot command and the screenshot command with `--path artifacts/verify-matheaufgaben/evidence/division-seed/page.ax.txt` and `--path artifacts/verify-matheaufgaben/evidence/division-seed/page.png`. The text file contains `Seed: 12345`. It contains `http://127.0.0.1:5199/division?seed=12345`. It contains twelve lines that are only `÷`. The first problem lines are `3`, `1`, `4`, `1`, `÷`, and `9`. The snapshot title is `matheaufgaben`. The snapshot contains `heading	Schriftliche Division`, `link	← Back to Overview`, `spinbutton	Enter seed...`, `button	Go`, and `button	New Worksheet`.
- **Reload the same URL.** Load the seed again. Run `node .agents/skills/verify-matheaufgaben/scripts/drive.mjs goto '/division?seed=12345' --text 'Seed: 12345'` and `node .agents/skills/verify-matheaufgaben/scripts/drive.mjs text > artifacts/verify-matheaufgaben/evidence/division-seed/load-b.txt`. Then run `cmp artifacts/verify-matheaufgaben/evidence/division-seed/load-a.txt artifacts/verify-matheaufgaben/evidence/division-seed/load-b.txt`. `cmp` exits 0.
- **Open seed 42.** Load the other seed. Run `node .agents/skills/verify-matheaufgaben/scripts/drive.mjs goto '/division?seed=42' --text 'Seed: 42'` and `node .agents/skills/verify-matheaufgaben/scripts/drive.mjs text > artifacts/verify-matheaufgaben/evidence/division-seed/seed-42.txt`. The file contains `Seed: 42` and the first problem lines `4`, `5`, `3`, `6`. Run `cmp -s artifacts/verify-matheaufgaben/evidence/division-seed/load-a.txt artifacts/verify-matheaufgaben/evidence/division-seed/seed-42.txt`. `cmp` exits 1 because the files differ. That exit is the expected result.

## Gotchas

- The overview link adds a random seed. It is not the proof of seed `12345`.
- Quote the `goto` path. An unquoted `?` is a zsh glob.
- Problem digits are separate lines. Do not require the single string `3141 ÷ 9`.
- The seed label alone is not proof. The two text files for seed `12345` must match.
- The print header is absent on screen. Do not look for it in `text` or in the screenshot.
- The app does not write the worksheet to disk. The second load is the second view.
