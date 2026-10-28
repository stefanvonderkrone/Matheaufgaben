# Overview

The overview lists Klasse 4 and Klasse 5 worksheets. A user opens a worksheet from a link. The link carries a random seed for that page load.

## Sub-features

- `overview-grades` shows both grade headings and the worksheet links.
- `overview-open` opens Schriftliche Division from its link.
- `overview-seed` puts a numeric `seed` query on the worksheet URL.

## How to get to it (user POV)

- Open `/`.
- Choose the link whose visible title is `Schriftliche Division`.

## Driving it with drive.mjs

Preconditions:

- Doctor prints `ok` for `http://127.0.0.1:5199`.
- Launch has already shown the overview once. A later `goto /` is still required, because another recipe may have left the browser on a worksheet.

- **Open the overview.** Load `/`. Run `node .agents/skills/verify-matheaufgaben/scripts/drive.mjs goto / --text 'Math Practice Worksheets'`. The URL is `http://127.0.0.1:5199/`.
- **Check the list.** Save the page text. Run `node .agents/skills/verify-matheaufgaben/scripts/drive.mjs text > artifacts/verify-matheaufgaben/evidence/overview/list.txt`. The file contains `Klasse 4` and `Klasse 5`. It contains `Schriftliche Division` and `Addition/Subtraktion 1`. It contains `Each worksheet gets a unique seed.` It does not contain `Noch keine Aufgaben in dieser Kategorie.`
- **Save the controls.** Run `node .agents/skills/verify-matheaufgaben/scripts/drive.mjs snapshot --path artifacts/verify-matheaufgaben/evidence/overview/list.ax.txt` and `node .agents/skills/verify-matheaufgaben/scripts/drive.mjs screenshot --path artifacts/verify-matheaufgaben/evidence/overview/list.png`. The snapshot contains `heading	Klasse 4`, `heading	Klasse 5`, and `link	Schriftliche Division Long Division Practice`.
- **Open the division link.** Choose the division link. Run `node .agents/skills/verify-matheaufgaben/scripts/drive.mjs click --role link --name 'Schriftliche Division Long Division Practice'`, then `node .agents/skills/verify-matheaufgaben/scripts/drive.mjs wait-text 'Schriftliche Division'`, then `node .agents/skills/verify-matheaufgaben/scripts/drive.mjs url`. The URL matches `http://127.0.0.1:5199/division?seed=` plus digits. The page text contains `Seed:` and the same digits.

## Gotchas

- The accessible name includes the description. `Schriftliche Division` alone does not match the link.
- The random seed is chosen when `/` renders. It stays until the next load of `/`.
- Do not use this random seed as the proof for seed `12345`.
- Both grades have worksheets. The empty-category sentence is not on the page.
