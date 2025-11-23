# E2E Tests con Playwright

Este directorio contiene las pruebas End-to-End (E2E) para el proyecto WatchGuide utilizando Playwright.

## 📋 Casos de Prueba Implementados

### 1. Autenticación y Rutas Protegidas (`auth.spec.ts`)
- ✅ Mostrar formulario de login
- ✅ Validar credenciales incorrectas
- ✅ Login exitoso con credenciales válidas
- ✅ Cambiar entre tabs de Login y Registro
- ✅ Verificar que rutas protegidas requieren autenticación
- ✅ Permitir acceso a rutas protegidas después del login
- ✅ Registro de nuevo usuario
- ✅ Validar contraseñas que no coinciden
- ✅ Cerrar sesión correctamente

### 2. CRUD de Películas (`movies.spec.ts`)
- ✅ Listar películas existentes
- ✅ Buscar películas por título
- ✅ Filtrar películas por género
- ✅ Filtrar películas por plataforma
- ✅ Ver detalles de una película
- ✅ Crear una nueva película
- ✅ Editar información de película (actualizar plataforma)
- ✅ Eliminar una película
- ✅ Agregar película a favoritos
- ✅ Agregar película a lista de "ver después"

## 🚀 Requisitos Previos

Antes de ejecutar las pruebas, asegúrate de tener:

1. **Node.js** (versión 18 o superior)
2. **Backend en ejecución** en `http://localhost:4000`
3. **Frontend en ejecución** en `http://localhost:4173`
4. **Base de datos MongoDB** activa con datos de prueba
5. **Usuario de prueba** creado con las siguientes credenciales:
   - Username: `testuser`
   - Password: `password123`

## 📦 Instalación

Desde la carpeta `e2e-tests/`, ejecuta:

```bash
npm install
```

Para instalar los navegadores de Playwright:

```bash
npx playwright install
```

## ▶️ Ejecutar las Pruebas

### Ejecutar todas las pruebas

```bash
npm test
```

### Ejecutar en modo UI (interactivo)

```bash
npx playwright test --ui
```

### Ejecutar un archivo específico

```bash
npx playwright test tests/auth.spec.ts
npx playwright test tests/movies.spec.ts
```

### Ejecutar en modo debug

```bash
npx playwright test --debug
```

### Ejecutar con headed browser (ver el navegador)

```bash
npx playwright test --headed
```

## 📊 Ver Reportes

Después de ejecutar las pruebas, puedes ver el reporte HTML:

```bash
npm run test:report
```

O directamente:

```bash
npx playwright show-report
```

## 🔧 Configuración

La configuración de Playwright se encuentra en `playwright.config.ts`:

- **Base URL**: `http://localhost:4173` (frontend)
- **Timeout**: 30 segundos por test
- **Navegadores**: Chromium (Chrome)
- **Screenshots**: Solo en caso de fallo
- **Videos**: Solo cuando hay fallos
- **Traces**: En el primer retry de un test fallido

## 📝 Estructura de Archivos

```
e2e-tests/
├── tests/
│   ├── auth.spec.ts       # Pruebas de autenticación
│   └── movies.spec.ts     # Pruebas CRUD de películas
├── playwright.config.ts   # Configuración de Playwright
├── package.json
└── README.md             # Este archivo
```

## 🐛 Troubleshooting

### Las pruebas fallan por timeout
- Verifica que el backend esté corriendo en `http://localhost:4000`
- Verifica que el frontend esté corriendo en `http://localhost:4173`
- Asegúrate de que MongoDB esté activo

### Error de autenticación
- Crea el usuario de prueba con username `testuser` y password `password123`
- Puedes usar el script de seed del backend: `npm run seed`

### No encuentra elementos en la página
- Asegúrate de que el frontend esté construido correctamente: `npm run build`
- Verifica que estés usando `npm run preview` en el frontend (no `npm run dev`)

## 📚 Recursos

- [Documentación de Playwright](https://playwright.dev/)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Locators](https://playwright.dev/docs/locators)
- [Assertions](https://playwright.dev/docs/test-assertions)

## 👥 Autores

- Carlos Ibáñez Q.
- Damián González G.
- Rodrigo Manríquez M.
