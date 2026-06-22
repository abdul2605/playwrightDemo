import { test as base, expect } from '@playwright/test';

/**
 * Thin wrapper around Playwright Test's `test` that, when running against
 * the TestMu AI cloud grid (RUN_ON=cloud), reports each test's pass/fail
 * status back to the TestMu AI session via the documented
 * `lambdatest_action: setTestStatus` evaluate call. This makes the
 * Automation Dashboard reflect actual assertion outcomes instead of
 * defaulting every session to "Completed".
 *
 * Reference: https://www.testmuai.com/support/docs/playwright-test-execution-setup/
 */
export const test = base.extend({});

test.afterEach(async ({ page }, testInfo) => {
  if (process.env.RUN_ON !== 'cloud') return;

  const status = testInfo.status === testInfo.expectedStatus ? 'passed' : 'failed';
  const remark = testInfo.error?.message ?? testInfo.title;

  try {
    await page.evaluate(
      (payload) => {},
      `lambdatest_action: ${JSON.stringify({
        action: 'setTestStatus',
        arguments: { status, remark },
      })}`
    );
  } catch {
    // The page/session may already be torn down on a hard failure — safe to ignore.
  }
});

export { expect };
