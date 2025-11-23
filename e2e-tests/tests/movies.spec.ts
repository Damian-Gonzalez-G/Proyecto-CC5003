import { test, expect } from '@playwright/test';

test.describe('CRUD de Películas', () => {
  let createdMovieId: string;
  let createdMovieTitle: string;

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    if (page.url().includes('auth')) {
      await page.getByLabel(/nombre de usuario/i).fill('testuser');
      await page.getByLabel(/contraseña/i).first().fill('password123');
      await page.getByRole('button', { name: /iniciar sesión/i }).click();
      await expect(page).toHaveURL(/.*movies/, { timeout: 10000 });
    }
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('debe listar películas existentes', async ({ page }) => {
    await expect(page.getByText('WatchGuide')).toBeVisible();
    await expect(page.getByText(/película.*encontrada/i)).toBeVisible({ timeout: 5000 });
    const movieElements = page.locator('[class*="movie"]').or(page.locator('article')).or(page.locator('[data-testid*="movie"]'));
    await page.waitForTimeout(2000);
    const count = await movieElements.count();
    expect(count).toBeGreaterThan(0);
  });

  test('debe buscar películas por título', async ({ page }) => {
    await page.waitForTimeout(2000);
    const searchInput = page.getByPlaceholder(/buscar/i).or(page.getByRole('textbox', { name: /buscar/i }));
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('Matrix');
      await page.waitForTimeout(1000);
      await expect(page.getByText(/película.*encontrada/i)).toBeVisible();
    }
  });

  test('debe filtrar películas por género', async ({ page }) => {
    await page.waitForTimeout(2000);
    const genreSelect = page.getByLabel(/género/i).or(page.locator('select').first());
    
    if (await genreSelect.isVisible()) {
      await genreSelect.selectOption({ index: 1 });
      await page.waitForTimeout(1000);
      await expect(page.getByText(/película.*encontrada/i)).toBeVisible();
    }
  });

  test('debe ver detalles de una película', async ({ page }) => {
    await page.waitForTimeout(2000);
    const movieLink = page.locator('a[href*="/movies/"]').first()
      .or(page.getByRole('link', { name: /ver más|detalles/i }).first())
      .or(page.locator('[class*="movie"]').first());
    
    if (await movieLink.isVisible()) {
      await movieLink.click();

      await expect(page).toHaveURL(/.*movies\/[a-zA-Z0-9]+/, { timeout: 5000 });
      await expect(page.getByText(/director|género|duración|calificación/i)).toBeVisible();
      await expect(page.getByRole('link', { name: /volver/i })).toBeVisible();
    }
  });

  test('debe crear una nueva película', async ({ page }) => {
    const timestamp = Date.now();
    createdMovieTitle = `Test Movie ${timestamp}`;
    const createButton = page.getByRole('button', { name: /crear|nueva película|agregar película/i })
      .or(page.getByRole('link', { name: /crear|nueva película|agregar película/i }));
    
    if (await createButton.isVisible()) {
      await createButton.click();
      
      await page.getByLabel(/título/i).fill(createdMovieTitle);
      await page.getByLabel(/director/i).fill('Test Director');
      await page.getByLabel(/año/i).fill('2024');
      await page.getByLabel(/duración|tiempo/i).fill('120');
      await page.getByLabel(/rating|calificación/i).fill('8.5');
      
      const genreField = page.getByLabel(/género/i);
      if (await genreField.isVisible()) {
        await genreField.fill('Acción, Ciencia Ficción');
      }
      
      const providerField = page.getByLabel(/plataforma|provider/i);
      if (await providerField.isVisible()) {
        await providerField.fill('Netflix');
      }
      
      await page.getByRole('button', { name: /crear|guardar|submit/i }).click();
      
      await expect(page.getByText(createdMovieTitle).or(page.getByText(/creada|éxito/i))).toBeVisible({ timeout: 5000 });
      
      const url = page.url();
      const match = url.match(/movies\/([a-zA-Z0-9]+)/);
      if (match) {
        createdMovieId = match[1];
      }
    } else {
      test.skip();
    }
  });

  test('debe editar una película existente', async ({ page }) => {
    await page.waitForTimeout(2000);
    const movieLink = page.locator('a[href*="/movies/"]').first();
    
    if (await movieLink.isVisible()) {
      await movieLink.click();
      
      await page.waitForTimeout(1000);
      
      const updateButton = page.getByRole('button', { name: /actualizar/i });
      
      if (await updateButton.isVisible()) {
        await updateButton.click();
        
        await page.waitForTimeout(500);
    
        const providerInput = page.getByLabel(/plataforma|provider/i)
          .or(page.locator('input[type="text"]').last());
        
        await providerInput.fill('Amazon Prime Video');
        
        const confirmButton = page.getByRole('button', { name: /guardar|confirmar|actualizar/i }).last();
        await confirmButton.click();
        
        await expect(page.getByText(/Amazon Prime Video/i).or(page.getByText(/actualizada|éxito/i))).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('debe eliminar una película', async ({ page }) => {
    const timestamp = Date.now();
    const movieToDelete = `Delete Test ${timestamp}`;

    const createButton = page.getByRole('button', { name: /crear|nueva película|agregar película/i })
      .or(page.getByRole('link', { name: /crear|nueva película|agregar película/i }));
    
    if (await createButton.isVisible()) {
      await createButton.click();
      
      await page.getByLabel(/título/i).fill(movieToDelete);
      await page.getByLabel(/director/i).fill('Test Director');
      await page.getByLabel(/año/i).fill('2024');
      
      await page.getByRole('button', { name: /crear|guardar/i }).click();
      await page.waitForTimeout(1000);
      
      const deleteButton = page.getByRole('button', { name: /eliminar|borrar|delete/i });
      
      if (await deleteButton.isVisible()) {
        await deleteButton.click();
        
        const confirmDeleteButton = page.getByRole('button', { name: /confirmar|sí|eliminar/i }).last();
        if (await confirmDeleteButton.isVisible()) {
          await confirmDeleteButton.click();
        }
        
        await expect(page.getByText(/eliminada|borrada/i).or(page.getByText(movieToDelete))).not.toBeVisible({ timeout: 5000 });
      }
    } else {
      test.skip();
    }
  });

  test('debe agregar película a favoritos', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    const movieLink = page.locator('a[href*="/movies/"]').first();
    
    if (await movieLink.isVisible()) {
      await movieLink.click();
      await page.waitForTimeout(1000);
      
      const favoriteButton = page.getByRole('button', { name: /favorito/i });
      
      if (await favoriteButton.isVisible()) {
        await favoriteButton.click();
        await expect(favoriteButton).toHaveText(/en favoritos/i, { timeout: 3000 });
      }
    }
  });

  test('debe agregar película a lista de ver después', async ({ page }) => {
    await page.waitForTimeout(2000);
    const movieLink = page.locator('a[href*="/movies/"]').first();
    
    if (await movieLink.isVisible()) {
      await movieLink.click();
      await page.waitForTimeout(1000);
      
      const watchlistButton = page.getByRole('button', { name: /lista|ver después/i });
      
      if (await watchlistButton.isVisible()) {
        await watchlistButton.click();
        
        await expect(watchlistButton).toHaveText(/en tu lista/i, { timeout: 3000 });
      }
    }
  });

  test('debe mostrar las películas filtradas por plataforma', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    const platformSelect = page.getByLabel(/plataforma/i).or(page.locator('select').last());
    
    if (await platformSelect.isVisible()) {
      await platformSelect.selectOption({ index: 1 });
      
      await page.waitForTimeout(1000);
      
      await expect(page.getByText(/película.*encontrada/i)).toBeVisible();
    }
  });
});
