# Playwright 101 Assignment — TestMu AI Selenium Playground

Playwright (TypeScript) test suite covering the three required scenarios against
[TestMu AI's Selenium Playground](https://www.testmuai.com/selenium-playground/):

1. **Simple Form Demo** — enter a message, click "Get Checked Value", confirm it's echoed back.
2. **Drag & Drop Sliders** — move the "Default value 15" slider to 95 and confirm the displayed value.
3. **Input Form Submit** — confirm the empty-submit validation error, then fill and submit successfully.

## Project structure

```
pages/      Page Object Model classes (one per playground demo page)
tests/      One spec file per scenario
utils/      Cloud capability builder + a test fixture for TestMu AI dashboard reporting
```

## Setup

```bash
npm install
npx playwright install        # downloads local browser binaries (only needed for local runs)
cp .env.example .env          # then fill in LT_USERNAME / LT_ACCESS_KEY
```

## Running the tests

| Command               | What it does                                                                 |
|------------------------|-------------------------------------------------------------------------------|
| `npm test`             | Runs locally in Chromium + Firefox (fast feedback loop while developing).    |
| `npm run test:cloud`   | Runs on the TestMu AI cloud grid across **Windows 10 / Chrome** and **macOS Catalina / Firefox** in parallel — this is the run that satisfies the assignment's cross-browser/OS requirement. |
| `npm run test:headed`  | Local run with a visible browser window.                                     |
| `npm run report`       | Opens the last local HTML report.                                            |

After a `test:cloud` run, get the **Test Session IDs** from the TestMu AI Automation
Dashboard (Build name: "Playwright 101 Assignment") — you'll need these for the exam
portal submission.

## Submission checklist (per the assignment PDF)

- `npm run test:cloud` passes across both browser/OS combinations.
- Network logs, video, screenshots, and console logs are visible for each session on the TestMu AI dashboard (enabled via `LT:Options` in `utils/capabilities.ts`).
- Push this repo to GitHub.
- Share the repo **privately** with `admin@testmuaicertifications.com`.
- Submit the GitHub repo URL + the TestMu AI Test Session IDs on the exam portal within 36 hours of the deadline.
