import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("PathPilot AI Accessibility & User Journey", () => {
  test("Home page should pass WCAG 2.1 AA accessibility audit", async ({ page }) => {
    await page.goto("/");

    // Run axe accessibility analysis
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Autofills preset and generates roadmap successfully", async ({ page }) => {
    await page.goto("/");

    // Click on preset
    const presetButton = page.getByRole("button", { name: /Select preset career: Full-Stack Web Developer/i });
    await presetButton.click();

    // Verify input populated
    const goalInput = page.getByLabel(/Target Career Goal/i);
    await expect(goalInput).toHaveValue(/Full-Stack/i);

    // Submit form
    const submitBtn = page.getByRole("button", { name: /Generate Career Roadmap/i });
    await submitBtn.click();

    // Verify roadmap view loaded
    await expect(page.getByRole("region", { name: /Generated Career Roadmap/i })).toBeVisible({
      timeout: 10000,
    });

    // Check off a task
    const taskCheckbox = page.getByRole("checkbox").first();
    await taskCheckbox.click();
    await expect(taskCheckbox).toHaveAttribute("aria-checked", "true");
  });
});
