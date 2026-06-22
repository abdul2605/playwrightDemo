import { Page } from '@playwright/test';

export class SeleniumPlaygroundPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open(): Promise<void> {
    await this.page.goto('https://www.testmuai.com/selenium-playground/');
  }

  /**
   * Opens a playground demo by its visible link text.
   *
   * Locator strategy: accessible role ("link") + accessible name. This
   * targets what a screen reader / real user actually perceives, so it
   * keeps working even if the page's internal class names or ids change —
   * generally preferable to id/class selectors for navigation elements.
   */
  async openDemo(linkText: string): Promise<void> {
    await this.page.getByRole('link', { name: linkText, exact: true }).click();
  }
}
