import { test } from '../utils/testmuFixtures';
import { SeleniumPlaygroundPage } from '../pages/SeleniumPlaygroundPage';
import { InputFormSubmitPage } from '../pages/InputFormSubmitPage';

test.describe('Scenario 3 — Input Form Submit', () => {
  test('shows a validation error on empty submit, then succeeds once filled in', async ({ page }) => {
    const playground = new SeleniumPlaygroundPage(page);
    const form = new InputFormSubmitPage(page);

    await playground.open();
    await playground.openDemo('Input Form Submit');

    await form.submitEmpty();
    await form.expectValidationError();

    await form.fillForm({
      name: 'Jordan Lee',
      email: 'jordan.lee@example.com',
      password: 'P@ssword123',
      company: 'TestMu AI',
      website: 'https://www.testmuai.com',
      country: 'United States',
      city: 'Calgary',
      address1: '123 Main Street',
      address2: 'Suite 400',
      state: 'Alberta',
      zipCode: 'T2P 1J9',
    });

    await form.submit();
    await form.expectSuccessMessage();
  });
});
