import { Page, Locator, expect } from '@playwright/test';

export interface ContactDetails {
  name: string;
  email: string;
  password: string;
  company: string;
  website: string;
  country: string;
  city: string;
  address1: string;
  address2: string;
  state: string;
  zipCode: string;
}

export class InputFormSubmitPage {
  readonly page: Page;
  readonly submitButton: Locator; // Locator strategy: accessible role + name
  readonly errorMessage: Locator; // Locator strategy: visible text
  readonly successMessage: Locator; // Locator strategy: visible text

  constructor(page: Page) {
    this.page = page;
    this.submitButton = page.getByRole('button', { name: 'Submit', exact: true });
    this.errorMessage = page.getByText('Please fill in the fields', { exact: false });
    this.successMessage = page.getByText(
      'Thanks for contacting us, we will get back to you shortly.',
      { exact: false }
    );
  }

  async submitEmpty(): Promise<void> {
    await this.submitButton.click();
  }

  async expectValidationError(): Promise<void> {
    await expect(this.errorMessage.first()).toBeVisible();
  }

  /**
   * Field locators below use placeholder text rather than internal ids —
   * confirmed against the assignment's own reference screenshot of the
   * Form Demo section, and a more robust strategy than guessing ids since
   * it targets exactly what's rendered to the user.
   */
  async fillForm(details: ContactDetails): Promise<void> {
    await this.page.getByPlaceholder('Name', { exact: true }).fill(details.name);
    await this.page.getByPlaceholder('Email', { exact: true }).fill(details.email);
    await this.page.getByPlaceholder('Password', { exact: true }).fill(details.password);
    await this.page.getByPlaceholder('Company', { exact: true }).fill(details.company);
    await this.page.getByPlaceholder('Website', { exact: true }).fill(details.website);

    // Country dropdown: selected by its visible option text ("using the
    // text property"), not by the option's underlying value attribute.
    await this.page.getByLabel('Country', { exact: false }).selectOption({ label: details.country });

    await this.page.getByPlaceholder('City', { exact: true }).fill(details.city);

    // The two address fields share the word "Address" in their placeholder
    // text (e.g. "Address1" / "Address 2"), so they're disambiguated by
    // position rather than by guessing the exact placeholder spelling.
    const addressInputs = this.page.getByPlaceholder(/address/i);
    await addressInputs.nth(0).fill(details.address1);
    await addressInputs.nth(1).fill(details.address2);

    await this.page.getByPlaceholder('State', { exact: true }).fill(details.state);

    // Locator strategy: XPath, included to demonstrate the strategy
    // alongside the placeholder/role-based locators used elsewhere.
    await this.page.locator('xpath=//input[contains(@placeholder, "Zip") or contains(@placeholder, "zip")]').fill(details.zipCode);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async expectSuccessMessage(): Promise<void> {
    await expect(this.successMessage).toBeVisible();
  }
}
