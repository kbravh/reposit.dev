import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should load the landing page successfully', async ({ page }) => {
    // Listen for console messages and errors
    page.on('console', msg =>
      console.log('BROWSER CONSOLE:', msg.type(), msg.text())
    );
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

    // Navigate to the home page
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Debug: Take screenshot and log page content
    await page.screenshot({ path: 'test-results/landing-page.png' });
    const bodyText = await page.textContent('body');
    console.log('PAGE BODY TEXT:', bodyText?.slice(0, 500));

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
