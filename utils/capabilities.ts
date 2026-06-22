/**
 * Builds the CDP WebSocket endpoint Playwright Test connects to in order to
 * run a project on TestMu AI's cloud grid (formerly LambdaTest).
 *
 * Reference: https://www.testmuai.com/support/docs/playwright-testing/
 *
 * The "LT:Options" block intentionally sets network/video/console to true,
 * per the assignment's requirement that network logs, video recordings,
 * and console logs be enabled for every cloud test run.
 */
export interface CloudCapabilityOptions {
  /** OS + version shown on the TestMu AI dashboard, e.g. "Windows 10". */
  platform: string;
  /**
   * Browser engine to request from the grid. "Chrome" / "MicrosoftEdge" are
   * real installed browsers; "pw-chromium" / "pw-firefox" / "pw-webkit" are
   * Playwright's own bundled browser binaries running on the remote VM.
   */
  browserName: 'Chrome' | 'MicrosoftEdge' | 'pw-chromium' | 'pw-firefox' | 'pw-webkit';
  browserVersion?: string;
  buildName?: string;
}

export function buildWsEndpoint({
  platform,
  browserName,
  browserVersion = 'latest',
  buildName = 'Playwright 101 Assignment',
}: CloudCapabilityOptions): string {
  const username = process.env.LT_USERNAME;
  const accessKey = process.env.LT_ACCESS_KEY;

  if (!username || !accessKey) {
    throw new Error(
      'Missing LT_USERNAME / LT_ACCESS_KEY environment variables. ' +
        'Copy .env.example to .env and fill in your TestMu AI credentials, ' +
        'or export them in your shell before running `npm run test:cloud`.'
    );
  }

  const ltOptions: Record<string, unknown> = {
    platform,
    build: buildName,
    name: `${platform} - ${browserName}`,
    user: username,
    accessKey,
    network: true,
    video: true,
    console: true,
    project: 'Playwright 101 Assignment',
  };

  // For Playwright's own bundled engines (pw-chromium / pw-firefox / pw-webkit),
  // TestMu AI needs to know which Playwright client version is driving the
  // session so it can spin up a matching binary on the remote VM.
  if (browserName.startsWith('pw-')) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { version } = require('@playwright/test/package.json');
    ltOptions.playwrightClientVersion = version;
  }

  const capabilities = {
    browserName,
    browserVersion,
    'LT:Options': ltOptions,
  };

  return `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(
    JSON.stringify(capabilities)
  )}`;
}
