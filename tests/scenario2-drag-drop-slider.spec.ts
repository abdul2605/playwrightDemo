import { test } from '../utils/testmuFixtures';
import { SeleniumPlaygroundPage } from '../pages/SeleniumPlaygroundPage';
import { SliderDemoPage } from '../pages/SliderDemoPage';

test.describe('Scenario 2 — Drag & Drop Sliders', () => {
  test('moving the "Default value 15" slider updates the range value to 95', async ({ page }) => {
    const playground = new SeleniumPlaygroundPage(page);
    const sliderDemo = new SliderDemoPage(page);

    await playground.open();
    await playground.openDemo('Drag & Drop Sliders');

    await sliderDemo.dragSliderTo('Default value 15', 95);
    await sliderDemo.expectVisibleValue('Default value 15', 95);
  });
});
