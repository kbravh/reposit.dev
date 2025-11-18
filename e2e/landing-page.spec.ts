import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should load the landing page successfully', async ({ page }) => {
    // Navigate to the home page
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Check that the page loads and displays the main heading
    await expect(
      page.getByRole('heading', { name: /your github repositories/i })
    ).toBeVisible();

    // Verify the Reposit branding is present
    await expect(page.getByText('Reposit').first()).toBeVisible();

    // Check that the main CTA button is visible
    await expect(
      page.getByRole('link', { name: /start organizing with github/i })
    ).toBeVisible();
  });
});
