# New worksheet

New worksheet gives the division page a new random seed. The seed on the page matches the URL. Back to Overview returns to the grade list.

## Sub-features

- `new-seed` changes the seed from `12345` to a new number.
- `new-match` shows that same number in the page text and in the URL.
- `new-back` returns to the overview.

## How to get to it (user POV)

- Open `/division?seed=12345`.
- Choose `New Worksheet`.
- Choose `← Back to Overview`.

## Driving it with drive.mjs

Preconditions:

- Doctor prints `ok` for `http://127.0.0.1:5199`.
- The current division seed is `12345`, so a change is visible.

- **Open the known seed.** Run `node .agents/skills/verify-matheaufgaben/scripts/drive.mjs goto '/division?seed=12345' --text 'Seed: 12345'`. Save the text with `node .agents/skills/verify-matheaufgaben/scripts/drive.mjs text > artifacts/verify-matheaufgaben/evidence/new-worksheet/before.txt`.
- **Choose New Worksheet.** Run `node .agents/skills/verify-matheaufgaben/scripts/drive.mjs click --role button --name 'New Worksheet'`. Read the URL with `node .agents/skills/verify-matheaufgaben/scripts/drive.mjs url`. The path is `/division?seed=` plus a number other than `12345`.
- **Match the seed label.** Save the text with `node .agents/skills/verify-matheaufgaben/scripts/drive.mjs text > artifacts/verify-matheaufgaben/evidence/new-worksheet/after.txt`. The `Seed:` number and the `seed` query are the same number. The file differs from `before.txt`. Run `node .agents/skills/verify-matheaufgaben/scripts/drive.mjs screenshot --path artifacts/verify-matheaufgaben/evidence/new-worksheet/page.png`.
- **Return to the overview.** Run `node .agents/skills/verify-matheaufgaben/scripts/drive.mjs click --role link --name '← Back to Overview'` and `node .agents/skills/verify-matheaufgaben/scripts/drive.mjs wait-text 'Math Practice Worksheets'`. The URL is `http://127.0.0.1:5199/`.

## Gotchas

- The new seed is a random integer from `0` through `999999`. Do not expect one fixed value.
- A run fails when the seed is still `12345`. Do not click again until the number changes.
- Compare the problem text, not only the seed label.
- The back link name includes the arrow `←`.
