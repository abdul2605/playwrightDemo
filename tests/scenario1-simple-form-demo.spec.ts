import { test } from '../utils/testmuFixtures';
import { SeleniumPlaygroundPage } from '../pages/SeleniumPlaygroundPage';
import { SimpleFormDemoPage } from '../pages/SimpleFormDemoPage';

test.describe('Scenario 1 — Simple Form Demo', () => {
  test('entered message is echoed back under "Your Message"', async ({ page }) => {
    const playground = new SeleniumPlaygroundPage(page);
    const simpleForm = new SimpleFormDemoPage(page);
    const message = 'Welcome to TestMu AI';

    await playground.open();
    await playground.openDemo('Simple Form Demo');
    await simpleForm.expectUrlContains('simple-form-demo');

    await simpleForm.enterMessage(message);
    await simpleForm.clickGetCheckedValue();
    await simpleForm.expectDisplayedMessage(message);
  });
});
