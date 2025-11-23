import { test, expect } from '@playwright/test';

test.describe('CRUD de Películas', () => {
  let createdMovieTitle: string;

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    if (page.url().includes('auth')) {
      await page.getByLabel(/nombre de usuario/i).fill('testuser');
      await page.getByLabel(/contraseña/i).first().fill('password123');
      await page.locator('form').getByRole('button', { name: /iniciar sesión/i }).click();
      await expect(page).toHaveURL(/.*movies/, { timeout: 10000 });
    }
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('debe listar películas existentes', async ({ page }) => {
    await expect(page.locator('.page-header')).toBeVisible({ timeout: 10000 });
    await expect(
      page.locator('.text-muted-foreground', { hasText: 'encontrada' })
    ).toBeVisible({ timeout: 10000 });
    const movieElements = page.locator('.movie-card');
    const count = await movieElements.count();
    expect(count).toBeGreaterThan(0);
  });

  test('debe buscar películas por título', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Buscar películas..."]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('Matrix');
    await expect(page.locator('.text-muted-foreground', { hasText: 'encontrada' })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.movie-card', { hasText: 'Matrix' })).toBeVisible({ timeout: 10000 });
  });

  test('debe filtrar películas por género', async ({ page }) => {
    const genreSelect = page.locator('.filter-bar select').first();
    await expect(genreSelect).toBeVisible();
    await genreSelect.selectOption({ index: 1 });
    await expect(page.locator('.text-muted-foreground', { hasText: 'encontrada' })).toBeVisible({ timeout: 10000 });
    const movieElements = page.locator('.movie-card');
    const count = await movieElements.count();
    expect(count).toBeGreaterThan(0);
  });

  test('debe ver detalles de una película', async ({ page }) => {
    const movieLink = page.locator('.movie-card').first();
    await expect(movieLink).toBeVisible();
    await movieLink.click();
    await expect(page.locator('h1.text-5xl')).toBeVisible();
    await expect(page.locator('span.font-medium.text-primary', { hasText: 'Director:' })).toBeVisible();
    await expect(page.locator('span.font-medium.text-primary', { hasText: 'Duración:' })).toBeVisible();
    await expect(page.locator('span.font-medium.text-primary', { hasText: 'Plataformas:' })).toBeVisible();
    await expect(page.locator('a', { hasText: 'Volver' })).toBeVisible();
  });

  test('debe editar una película existente', async ({ page }) => {
    const movieLink = page.locator('.movie-card').first();
    await expect(movieLink).toBeVisible();
    await movieLink.click();
    const updateButton = page.locator('button', { hasText: /actualizar/i });
    await expect(updateButton).toBeVisible();
    await updateButton.click();
    const providerInput = page.locator('input[name="provider"]');
    await providerInput.fill('Amazon Prime Video');
    const confirmButton = page.locator('button', { hasText: /guardar|confirmar|actualizar/i });
    await expect(confirmButton).toBeVisible();
    await confirmButton.click();
    await expect(page.locator('.movie-card', { hasText: 'Amazon Prime Video' })).toBeVisible({ timeout: 10000 });
  });

  test('debe agregar película a favoritos', async ({ page }) => {
    const movieLink = page.locator('.movie-card').first();
    await expect(movieLink).toBeVisible();
    await movieLink.click();
    const favoriteButton = page.locator('button', { hasText: /favorito/i });
    await expect(favoriteButton).toBeVisible();
    await favoriteButton.click();
    await expect(favoriteButton).toHaveText(/en favoritos/i, { timeout: 3000 });
  });

  test('debe agregar película a lista de ver después', async ({ page }) => {
    const movieLink = page.locator('.movie-card').first();
    await expect(movieLink).toBeVisible();
    await movieLink.click();
    const watchlistButton = page.locator('button', { hasText: /lista|ver después/i });
    await expect(watchlistButton).toBeVisible();
    await watchlistButton.click();
    await expect(watchlistButton).toHaveText(/en tu lista/i, { timeout: 3000 });
  });

  test('debe mostrar las películas filtradas por plataforma', async ({ page }) => {
    const platformSelect = page.locator('.filter-bar select').last();
    await expect(platformSelect).toBeVisible();
    await platformSelect.selectOption({ index: 1 });
    await expect(page.locator('.text-muted-foreground', { hasText: 'encontrada' })).toBeVisible({ timeout: 10000 });
    const movieElements = page.locator('.movie-card');
    const count = await movieElements.count();
    expect(count).toBeGreaterThan(0);
  });
});
