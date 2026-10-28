---
name: verify-matheaufgaben
description: Drive the Matheaufgaben web app in Chrome on a private Vite port. Use it to prove a worksheet seed or an overview link.
---

# Verify Matheaufgaben

Matheaufgaben is a Vite + React worksheet app. A user opens a page in the browser and reads a generated worksheet. The worksheet depends on the `seed` query. The app has no login, no database, and no saved files.

Run every command from the repo root. Quote every path that contains `?`. In zsh, an unquoted `?` is a glob.

Read `features/README.md` before a proof. Drive the feature file that matches the task. One entry point does not prove the others.

## Launch

Install dependencies when `node_modules/.bin/vite` is missing.

```bash
npm install
```

Start the verification instance.

```bash
node .agents/skills/verify-matheaufgaben/scripts/drive.mjs launch
```

The command starts `node_modules/.bin/vite` with `--host 127.0.0.1 --port 5199 --strictPort`. Port 5199 is the verification port. `npm run dev` uses port 5173. Do not take port 5173. That port may belong to the user.

Launch then starts Chrome with a new profile under `artifacts/verify-matheaufgaben/run/chrome-profile`. The browser is headless. The script looks for a binary in this order.

1. `VERIFY_CHROME` when it is set.
2. The newest `chromium-*` build under `~/Library/Caches/ms-playwright`, except headless-shell builds.
3. Google Chrome.
4. Google Chrome Canary.
5. Chromium.

The proof run used Google Chrome for Testing from `chromium-1228` in that cache. This Mac has no Google Chrome.app. Chrome Canary is installed and was not selected.

Launch opens `http://127.0.0.1:5199/` and waits until the page shows `Math Practice Worksheets` and `Schriftliche Division`. Ready means those words are visible. A listening port is not enough.

Stdout ends with these lines when the instance is usable.

```text
ready http://127.0.0.1:5199
pid <vite-pid>
chrome <chrome-pid>
```

The app needs no migration and no seed file. An empty Chrome profile is the empty data directory. Worksheets are computed in the browser from the URL seed. A path with no `seed` uses seed `12345` on the worksheet pages.

Set `VERIFY_PORT` to another free port when 5199 is taken. Launch stops when the port has a listener. It does not kill that listener. The script stores one instance in `artifacts/verify-matheaufgaben/run/state.json`. Do not start a second instance. A second launch would replace that file and orphan the first process.

A failed launch deletes the process it started. If a later command fails, run cleanup before the next launch.

## Doctor

Run doctor before a drive and whenever the page looks wrong.

```bash
node .agents/skills/verify-matheaufgaben/scripts/drive.mjs doctor
```

Doctor is read-only. It does not start processes and it does not change the page.

Exit 0 prints `ok` and these fields.

- `url` is `http://127.0.0.1:5199` unless `VERIFY_PORT` is set.
- `pid` is the Vite process from launch.
- `port` matches the state file.
- `chrome` is the Chrome process from launch.
- `git` is the `HEAD` recorded at launch. Doctor fails when `HEAD` changed.
- `version` is the `package.json` version recorded at launch. The current version is `0.0.0`.
- `title` is `matheaufgaben`.
- `auth` is `none`.

Doctor also checks all of the following.

- The Vite pid is alive and its command contains `vite` and `--port` for this port.
- `lsof` shows that pid, or a child of it, listening on the port.
- `GET /` returns HTML with `<title>matheaufgaben</title>`.
- `GET /src/main.tsx` returns the dev module that contains `createRoot`.
- The state file says launch already saw the overview heading.

Do not drive the instance when doctor fails. Do not attach to a Vite process that this launch did not start.

## Drive

`drive.mjs` talks to the Chrome process from launch. It clicks and fills through the accessibility tree and the real input events. It does not call React setters.

Useful commands:

```bash
node .agents/skills/verify-matheaufgaben/scripts/drive.mjs goto '/division?seed=12345' --text 'Seed: 12345'
node .agents/skills/verify-matheaufgaben/scripts/drive.mjs click --role link --name 'Schriftliche Division Long Division Practice'
node .agents/skills/verify-matheaufgaben/scripts/drive.mjs click --role button --name 'New Worksheet'
node .agents/skills/verify-matheaufgaben/scripts/drive.mjs fill --placeholder 'Enter seed...' --value 42
node .agents/skills/verify-matheaufgaben/scripts/drive.mjs text
node .agents/skills/verify-matheaufgaben/scripts/drive.mjs url
node .agents/skills/verify-matheaufgaben/scripts/drive.mjs wait-text 'Seed: 42'
node .agents/skills/verify-matheaufgaben/scripts/drive.mjs snapshot --path artifacts/verify-matheaufgaben/evidence/division-seed/page.ax.txt
node .agents/skills/verify-matheaufgaben/scripts/drive.mjs screenshot --path artifacts/verify-matheaufgaben/evidence/division-seed/page.png
```

`goto` loads the path on the verification origin. `--text` waits until the page text contains that string.

`click` requires one exact accessibility name for that role. A link name on the overview is the title, one space, then the description. The seed box role is `spinbutton`. Its name is the placeholder.

`fill` focuses the input with that placeholder, selects the current value, and inserts the new value. The seed box is prefilled. Fill replaces that text. The command fails when the input does not keep the value.

`text` prints `document.body.innerText`. Problem digits are on separate lines. `snapshot` writes the URL, the document title, and the named headings, links, buttons, and inputs. `screenshot` writes the current viewport as PNG.

After a click, run `wait-text` or `url` before you assert. Do not sleep for a fixed time.

English worksheet controls are `← Back to Overview`, placeholder `Enter seed...`, button `Go`, and button `New Worksheet`. Those pages are `/division`, `/schriftliche-division-mit-rest`, and `/multiplication`.

German worksheet controls are `← Zurück zur Übersicht`, placeholder `Seed eingeben...`, button `Los`, and button `Neues Arbeitsblatt`. The other worksheet pages use those words.

The overview headings are `Math Practice Worksheets`, `Klasse 4`, and `Klasse 5`.

## Evidence

Write proof under `artifacts/verify-matheaufgaben/evidence/` plus the feature id. Create that directory before a shell redirect. Cleanup does not delete it.

A proof must use the user path in the feature file. Do not pass a seed through a test-only function. The URL and the buttons are the user path.

Capture the action and the result.

- Save `text` before and after the action.
- Save a snapshot and a screenshot of the result. The document title in the snapshot is `matheaufgaben`. The page shows the worksheet heading and the seed.
- For a seed, load the same URL a second time. The two text files must match. The app stores the worksheet only in the URL. There is no database row to read.
- For a different seed, the text file must differ. Check the digits, not only the `Seed:` line.
- There is no external service on this path. Do not add a mock.

The screen does not show the print header. The print header uses CSS that applies only while printing. Do not treat a screen shot as a print proof.

## Cleanup

Stop only the recorded processes.

```bash
node .agents/skills/verify-matheaufgaben/scripts/drive.mjs cleanup
```

Cleanup sends `SIGTERM`, then `SIGKILL`, to the Chrome pid and the Vite pid in the state file. It then deletes `artifacts/verify-matheaufgaben/run`. It does not delete `artifacts/verify-matheaufgaben/evidence`. It does not kill a process by name.

When the state file is already gone, cleanup prints `nothing to clean` and exits 0.

Run cleanup after a failed drive so the port and the Chrome profile do not stay behind.

## Helpers

The helper is executable.

```bash
node .agents/skills/verify-matheaufgaben/scripts/drive.mjs launch
node .agents/skills/verify-matheaufgaben/scripts/drive.mjs doctor
node .agents/skills/verify-matheaufgaben/scripts/drive.mjs goto '/division?seed=12345' --text 'Seed: 12345'
node .agents/skills/verify-matheaufgaben/scripts/drive.mjs click --role button --name Go
node .agents/skills/verify-matheaufgaben/scripts/drive.mjs fill --placeholder 'Enter seed...' --value 42
node .agents/skills/verify-matheaufgaben/scripts/drive.mjs text
node .agents/skills/verify-matheaufgaben/scripts/drive.mjs url
node .agents/skills/verify-matheaufgaben/scripts/drive.mjs wait-text 'Seed: 42'
node .agents/skills/verify-matheaufgaben/scripts/drive.mjs snapshot --path artifacts/verify-matheaufgaben/evidence/division-seed/page.ax.txt
node .agents/skills/verify-matheaufgaben/scripts/drive.mjs screenshot --path artifacts/verify-matheaufgaben/evidence/division-seed/page.png
node .agents/skills/verify-matheaufgaben/scripts/drive.mjs cleanup
```
