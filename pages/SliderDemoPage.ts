import { Page, Locator, expect } from '@playwright/test';

export class SliderDemoPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Resolves the smallest <div> that contains BOTH the visible
   * "Default value N" label and an <input type="range">.
   *
   * Deliberately NOT hardcoded to an internal id like "#slider3": the
   * playground numbers its eight sliders sequentially in the DOM, and that
   * numbering is an undocumented implementation detail that could shift if
   * the markup is ever reordered. Locating by the visible label instead
   * guarantees we always operate on whichever slider currently reads
   * "Default value 15", regardless of its underlying id.
   *
   * Locator strategy 3: text-based filter, scoped with a structural filter.
   */
  private sliderContainer(labelText: string): Locator {
    return this.page
      .locator('div')
      .filter({ has: this.page.getByText(labelText, { exact: true }) })
      .filter({ has: this.page.locator('input[type="range"]') })
      .last();
  }

  /**
   * Moves the slider identified by its default-value label to a target
   * value using keyboard arrow presses on the focused range input.
   *
   * Keyboard interaction is used instead of pixel-offset mouse dragging:
   * offset-based dragging is brittle (it depends on the slider's rendered
   * pixel width, which varies by viewport/zoom/OS font rendering — exactly
   * the kind of brittle wait/interaction logic that causes intermittent
   * cross-browser failures). Arrow-key presses move the native <input
   * type="range"> by exactly one `step` per keystroke regardless of how
   * many pixels that represents on screen, so the same code is reliable
   * across the Windows/Chrome and macOS/Firefox grid combinations.
   */
  async dragSliderTo(defaultValueLabel: string, targetValue: number): Promise<void> {
    const container = this.sliderContainer(defaultValueLabel);
    const slider = container.locator('input[type="range"]'); // Locator strategy 4: attribute selector

    await slider.scrollIntoViewIfNeeded();
    await slider.focus();

    const { min, max, step, current } = await slider.evaluate((el) => {
      const input = el as HTMLInputElement;
      return {
        min: Number(input.min || 0),
        max: Number(input.max || 100),
        step: Number(input.step || 1),
        current: Number(input.value),
      };
    });

    if (targetValue > max || targetValue < min) {
      throw new Error(
        `Target value ${targetValue} is outside this slider's [${min}, ${max}] range.`
      );
    }

    const presses = Math.round((targetValue - current) / step);
    const key = presses >= 0 ? 'ArrowRight' : 'ArrowLeft';

    for (let i = 0; i < Math.abs(presses); i++) {
      await slider.press(key);
    }

    await expect(slider).toHaveValue(String(targetValue));
  }

  /** Confirms the on-screen value badge users actually see has updated. */
  async expectVisibleValue(defaultValueLabel: string, expectedValue: number): Promise<void> {
    const container = this.sliderContainer(defaultValueLabel);
    await expect(container.getByText(String(expectedValue), { exact: true })).toBeVisible();
  }
}
