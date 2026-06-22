import { Page, Locator, expect } from '@playwright/test';

/**
 * Element ids below are verified directly against TestMu AI's own
 * published Playwright/Selenium tutorials for this exact page
 * (https://www.testmuai.com/selenium-playground/simple-form-demo/):
 *   - input#user-message
 *   - button inside #showInput
 *   - div#message (the "Your Message:" readout)
 */
export class SimpleFormDemoPage {
  readonly page: Page;
  readonly messageInput: Locator; // Locator strategy 1: CSS id
  readonly getCheckedValueButton: Locator; // Locator strategy 2: CSS descendant selector
  readonly resultMessage: Locator; // Locator strategy 1 (CSS id), different element

  constructor(page: Page) {
    this.page = page;
    this.messageInput = page.locator('#user-message');
    this.getCheckedValueButton = page.locator('#showInput button');
    this.resultMessage = page.locator('#message');
  }

  async expectUrlContains(fragment: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(fragment));
  }

  async enterMessage(message: string): Promise<void> {
    await this.messageInput.fill(message);
  }

  async clickGetCheckedValue(): Promise<void> {
    await this.getCheckedValueButton.click();
  }

  async expectDisplayedMessage(expected: string): Promise<void> {
    await expect(this.resultMessage).toHaveText(expected);
  }
}
