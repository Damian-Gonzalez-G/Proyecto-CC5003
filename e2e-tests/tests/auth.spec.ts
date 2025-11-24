import { test, expect } from '@playwright/test';

test.describe('Autenticación y Rutas Protegidas', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('debe mostrar el formulario de login', async ({ page }) => {
    await expect(page).toHaveURL(/.*auth/);
    
    await expect(page.getByRole('heading', { name: 'WatchGuide' })).toBeVisible();
    
    await expect(page.getByLabel(/nombre de usuario/i)).toBeVisible();
    await expect(page.getByLabel(/contraseña/i)).toBeVisible();
  });

  test('debe mostrar error al intentar login con credenciales inválidas', async ({ page }) => {
    await page.getByLabel(/nombre de usuario/i).fill('usuarioInvalido');
    await page.getByLabel(/contraseña/i).first().fill('passwordIncorrecto');
    await page.getByRole('button', { name: /iniciar sesión/i }).last().click();
    await expect(page.getByText(/invalid username or password/i)).toBeVisible({ timeout: 5000 });
  });

  test('debe permitir login exitoso con credenciales válidas', async ({ page }) => {
    const uniqueUsername = `testuser${Date.now()}`;
    await page.goto('/auth?tab=register');
    const registerTab = page.getByRole('button', { name: /registrarse/i });
    if (await registerTab.isVisible()) {
      await registerTab.click();
    }
    await page.getByLabel(/nombre completo/i).fill('Usuario de Prueba');
    await page.getByLabel(/nombre de usuario/i).fill(uniqueUsername);
    await page.getByLabel(/^contraseña/i).fill('password123');
    await page.getByLabel(/confirmar contraseña/i).fill('password123');
    await page.getByRole('button', { name: /crear cuenta/i }).click();
    const logoutButton = page.getByRole('button', { name: /cerrar sesión|logout/i });
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      await expect(page).toHaveURL(/.*auth/, { timeout: 5000 });
    }
    await page.getByLabel(/nombre de usuario/i).fill(uniqueUsername);
    await page.getByLabel(/contraseña/i).first().fill('password123');
    await page.getByRole('button', { name: /iniciar sesión/i }).last().click();
    await expect(page).toHaveURL(/.*movies/, { timeout: 10000 });
    await expect(page.getByRole('heading', { name: /WatchGuide/i })).toBeVisible();
  });

  test('debe cambiar entre tabs de Login y Registro', async ({ page }) => {
    await page.goto('/auth?tab=login');
    await expect(page.getByRole('button', { name: /iniciar sesión/i }).first()).toBeVisible();
    const registerTab = page.getByRole('button', { name: /registrarse/i }).first();
    await registerTab.click();
    await expect(page.getByLabel(/nombre completo/i)).toBeVisible();
    await expect(page.getByLabel(/confirmar contraseña/i)).toBeVisible();
    const loginTab = page.getByRole('button', { name: /iniciar sesión/i }).first();
    await loginTab.click();
    await expect(page.getByLabel(/nombre completo/i)).not.toBeVisible();
    await expect(page.getByLabel(/nombre de usuario/i)).toBeVisible();
    await expect(page.getByLabel(/contraseña/i)).toBeVisible();
  });

  test('debe validar que rutas protegidas requieren autenticación', async ({ page }) => {
    await page.goto('/profile');
    await expect(page).toHaveURL(/.*auth/, { timeout: 5000 });
  });

  test('debe permitir acceso a rutas protegidas después del login', async ({ page }) => {
    const uniqueUsername = `testuser${Date.now()}`;
    await page.goto('/auth?tab=register');
    const registerTab = page.getByRole('button', { name: /registrarse/i });
    if (await registerTab.isVisible()) {
      await registerTab.click();
    }
    await page.getByLabel(/nombre completo/i).fill('Usuario de Prueba');
    await page.getByLabel(/nombre de usuario/i).fill(uniqueUsername);
    await page.getByLabel(/^contraseña/i).fill('password123');
    await page.getByLabel(/confirmar contraseña/i).fill('password123');
    await page.getByRole('button', { name: /crear cuenta/i }).click();
    const logoutButton = page.getByRole('button', { name: /cerrar sesión|logout/i });
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      await expect(page).toHaveURL(/.*auth/, { timeout: 5000 });
    }
    await page.getByLabel(/nombre de usuario/i).fill(uniqueUsername);
    await page.getByLabel(/contraseña/i).first().fill('password123');
    await page.getByRole('button', { name: /iniciar sesión/i }).last().click();
    await expect(page).toHaveURL(/.*movies/, { timeout: 10000 });
    await page.goto('/profile');
    await expect(page).toHaveURL(/.*profile/);
    await expect(page.getByRole('link', { name: 'Favoritos' })).toBeVisible({ timeout: 5000 });
  });

  test('debe permitir registro de nuevo usuario', async ({ page }) => {
    await page.goto('/auth?tab=register');
    const registerTab = page.getByRole('button', { name: /registrarse/i });
    if (await registerTab.isVisible()) {
      await registerTab.click();
    }
    const uniqueUsername = `testuser${Date.now()}`;
    await page.getByLabel(/nombre completo/i).fill('Usuario de Prueba');
    await page.getByLabel(/nombre de usuario/i).fill(uniqueUsername);
    await page.getByLabel(/^contraseña/i).fill('password123');
    await page.getByLabel(/confirmar contraseña/i).fill('password123');
    await page.getByRole('button', { name: /crear cuenta/i }).click();
    await expect(page).toHaveURL(/.*movies/, { timeout: 10000 });
  });

  test('debe mostrar error al registrar con contraseñas que no coinciden', async ({ page }) => {
    await page.goto('/auth?tab=register');
    const registerTab = page.getByRole('button', { name: /registrarse/i });
    if (await registerTab.isVisible()) {
      await registerTab.click();
    }
    await page.getByLabel(/nombre completo/i).fill('Usuario de Prueba');
    await page.getByLabel(/nombre de usuario/i).fill('newuser');
    await page.getByLabel(/^contraseña/i).fill('password123');
    await page.getByLabel(/confirmar contraseña/i).fill('password456');
    await page.getByRole('button', { name: /crear cuenta|registrarme/i }).last().click();
    await expect(page.getByText(/no coinciden/i)).toBeVisible();
  });

  test('debe cerrar sesión correctamente', async ({ page }) => {
    const uniqueUsername = `testuser${Date.now()}`;
    await page.goto('/auth?tab=register');
    const registerTab = page.getByRole('button', { name: /registrarse/i });
    if (await registerTab.isVisible()) {
      await registerTab.click();
    }
    await page.getByLabel(/nombre completo/i).fill('Usuario de Prueba');
    await page.getByLabel(/nombre de usuario/i).fill(uniqueUsername);
    await page.getByLabel(/^contraseña/i).fill('password123');
    await page.getByLabel(/confirmar contraseña/i).fill('password123');
    await page.getByRole('button', { name: /crear cuenta/i }).click();
    const logoutButton = page.getByRole('button', { name: /cerrar sesión|logout/i });
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      await expect(page).toHaveURL(/.*auth/, { timeout: 5000 });
    }
    await page.getByLabel(/nombre de usuario/i).fill(uniqueUsername);
    await page.getByLabel(/contraseña/i).first().fill('password123');
    await page.getByRole('button', { name: /iniciar sesión/i }).last().click();
    await expect(page).toHaveURL(/.*movies/, { timeout: 10000 });
    const logoutButton2 = page.getByRole('button', { name: /cerrar sesión|logout/i });
    if (await logoutButton2.isVisible()) {
      await logoutButton2.click();
      await expect(page).toHaveURL(/.*auth/, { timeout: 5000 });
    }
  });
});
