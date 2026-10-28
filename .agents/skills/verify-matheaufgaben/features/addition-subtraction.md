# Addition and subtraction

Addition and subtraction opens the Klasse 5 worksheet. The controls are German. Seed `42` shows ten fixed problems.

## Sub-features

- `addition-open` shows seed `42` and the heading `Addition/Subtraktion 1`.
- `addition-problems` shows ten labeled problems for that seed.
- `addition-controls` exposes `Los` and `Neues Arbeitsblatt`.

## How to get to it (user POV)

- Open `/addition-subtraktion-1?seed=42`.
- From the overview, choose the link whose title is `Addition/Subtraktion 1`. That link uses a random seed, so the fixed proof uses the URL above.

## Driving it with drive.mjs

Preconditions:

- Doctor prints `ok` for `http://127.0.0.1:5199`.

- **Open seed 42.** Run `node .agents/skills/verify-matheaufgaben/scripts/drive.mjs goto '/addition-subtraktion-1?seed=42' --text 'Seed: 42'`. The URL is `http://127.0.0.1:5199/addition-subtraktion-1?seed=42`.
- **Save the worksheet.** Run `node .agents/skills/verify-matheaufgaben/scripts/drive.mjs text > artifacts/verify-matheaufgaben/evidence/addition-subtraction/seed-42.txt`. The file contains `Seed: 42`. It contains `http://127.0.0.1:5199/addition-subtraktion-1?seed=42`. It contains `a)280 + 628 =`. It contains `b)689 − 614 =`. The minus sign in `b` is U+2212, not a hyphen.
- **Save the controls.** Run `node .agents/skills/verify-matheaufgaben/scripts/drive.mjs snapshot --path artifacts/verify-matheaufgaben/evidence/addition-subtraction/page.ax.txt` and `node .agents/skills/verify-matheaufgaben/scripts/drive.mjs screenshot --path artifacts/verify-matheaufgaben/evidence/addition-subtraction/page.png`. The snapshot contains `heading	Addition/Subtraktion 1`, `link	← Zurück zur Übersicht`, `spinbutton	Seed eingeben...`, `button	Los`, and `button	Neues Arbeitsblatt`. It does not contain `button	Go`.
- **Reload the same URL.** Run `node .agents/skills/verify-matheaufgaben/scripts/drive.mjs goto '/addition-subtraktion-1?seed=42' --text 'a)280 + 628 ='` and `node .agents/skills/verify-matheaufgaben/scripts/drive.mjs text > artifacts/verify-matheaufgaben/evidence/addition-subtraction/reload.txt`. Then run `cmp artifacts/verify-matheaufgaben/evidence/addition-subtraction/seed-42.txt artifacts/verify-matheaufgaben/evidence/addition-subtraction/reload.txt`. `cmp` exits 0.

## Gotchas

- This page does not use `Go` or `New Worksheet`. A click on those names fails.
- The overview link for this worksheet adds a random seed. Use `?seed=42` for the fixed problems.
- The second problem uses the minus character `−`. A hyphen does not match the page text.
- There is no space after `a)` in `a)280 + 628 =`.
