# WatchGuide - Plataforma de Gestión de Películas

## Tema General
WatchGuide es una aplicación web diseñada para descubrir, gestionar y realizar un seguimiento de películas. Permite a los usuarios explorar un catálogo de películas, ver detalles, filtrar por género y plataforma, y mantener listas personalizadas de "Favoritos" y "Ver después".

## Estructura del Estado Global
La aplicación utiliza **Zustand** para la gestión del estado global, dividida en dos stores principales:

- **`authStore`**: Maneja la autenticación del usuario, incluyendo el token de sesión, información del usuario (perfil, favoritos, watchlist) y funciones de login/logout.
- **`moviesStore`**: Gestiona el catálogo de películas, estados de carga y errores, permitiendo una experiencia fluida al navegar y filtrar el contenido.

## Mapa de Rutas y Flujo de Autenticación

### Rutas
- **Públicas**:
  - `/auth`: Página de autenticación con pestañas para Iniciar Sesión y Registrarse.
- **Protegidas** (requieren inicio de sesión):
  - `/movies`: Página principal (Home) con el catálogo, búsqueda y filtros.
  - `/movies/create`: Formulario para añadir una nueva película.
  - `/movies/:id`: Vista detallada de una película específica.
  - `/profile`: Perfil del usuario con sus listas de favoritos y ver después.

### Flujo de Autenticación
1. El usuario accede a la aplicación y es redirigido a `/auth` si no tiene sesión activa.
2. Al iniciar sesión o registrarse, se recibe un token JWT que se almacena (vía cookies/estado) y se actualiza el `authStore`.
3. El componente `ProtectedRoute` verifica el estado de autenticación (`isAuthenticated`). Si es válido, permite el acceso a las rutas protegidas; de lo contrario, redirige al login.

## Tests E2E
Se utiliza **Playwright** para las pruebas de extremo a extremo (E2E), cubriendo los flujos críticos de la aplicación:

- **Autenticación (`auth.spec.ts`)**:
  - Login exitoso y manejo de errores.
  - Registro de nuevos usuarios.
  - Protección de rutas (redirección si no hay sesión).
  - Cierre de sesión (Logout).
- **Gestión de Películas (`movies.spec.ts`)**:
  - Listado y búsqueda de películas.
  - Filtrado por género y plataforma.
  - Creación, edición y eliminación de películas (CRUD).
  - Adición a listas de favoritos y ver después.

## Librería de Estilos y Diseño
El proyecto utiliza **Tailwind CSS** (v4) como motor principal de estilos, complementado con **Vanilla CSS** para configuraciones globales.

**Decisiones de Diseño**:
- **Interfaz Moderna**: Uso de gradientes, efectos de desenfoque (backdrop-blur) y transiciones suaves.
- **Responsividad**: Diseño adaptativo que funciona en dispositivos móviles y de escritorio.
- **Feedback Visual**: Indicadores de carga (spinners), estados hover y mensajes de error/éxito claros.

## Instalar dependencias y levantar backend

```bash
cd backend
npm install
```

#### Requisitos backend
- Node.js ≥ 18
- MongoDB local (puedes usar Homebrew, Docker o instalador oficial)

#### Iniciar MongoDB
```bash
mkdir -p ~/data/db
mongod --dbpath ~/data/db
```

#### Configurar variables de entorno
Crea un archivo `.env` en `/backend`:
```
MONGODB_URI=mongodb://127.0.0.1:27017/moviesdb
PORT=4000
JWT_SECRET=un_secreto_seguro
```

#### Levantar backend
```bash
npm run dev
```

## Instalar dependencias y levantar frontend

```bash
cd ../frontend
npm install
npm run build
npm run preview
```

## Pruebas E2E

Para que los tests funcionen correctamente, debes crear un usuario con el nombre de usuario "testuser" y la contraseña "password123".

```bash
cd ../e2e-tests
npm install
npx playwright install
npm test
```

---


## Despliegue (Post-entrega)
La aplicación se desplegó en `http://fullstack.dcc.uchile.cl:7175` siguiendo estas instrucciones:

1. Se compiló el frontend:
frontend % npm run build
2. Se copió la carpeta resultante (dist) en una carpeta llamada frontend dentro de la carpeta backend (backend/frontend/dist).
3. Se modificaron algunos archivos, el .env para adaptar el proyecto a correr deployado y el index.ts para servir el frontend desde el backend.
4. Se compiló el backend y se copió a una carpeta creada en el servidor, desde una terminal:
scp -P 219 -r backend fullstack@fullstack.dcc.uchile.cl:~/watchguide/
5. En la misma terminal, se conectó al servidor:
ssh -p 219 fullstack@fullstack.dcc.uchile.cl
Se ingresó la clave de las credenciales y se navegó hasta la carpeta backend.
6. Se hizo:
npm install
y luego se creó una sesión persistente con screen:
screen -S WatchGuide
después se inició el servidor:
npm run start
como es una sesión persistente screen, se "despegó":
Ctrl + A -> D

Con esto la aplicación quedó disponible en `http://fullstack.dcc.uchile.cl:7175`, completamente funcional, sin la necesidad de tener abierta una terminal, accesible desde cualquier dispositivo.

