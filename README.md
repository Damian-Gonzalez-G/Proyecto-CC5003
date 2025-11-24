### Integrantes
- Carlos Ibáñez Q.
- Damián González G.
- Rodrigo Manríquez M.

# Proyecto CC5003: WatchGuide

Aplicación web fullstack para gestión de películas, con autenticación de usuarios, favoritos, listas personalizadas y pruebas E2E. Incluye frontend en React + Zustand, backend Node/Express + MongoDB, y tests automáticos con Playwright.


## Instrucciones de instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone <URL-del-repo>
```

### 2. Instalar dependencias y levantar backend

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

#### Poblar base de datos (opcional)
```bash
npm run seed      # Borra y carga todo
npm run seed:upsert  # Inserta/actualiza sin borrar
```

### 3. Instalar dependencias y levantar frontend

```bash
cd ../frontend
npm install
npm run build
npm run preview
```

### 4. Pruebas E2E

```bash
cd ../e2e-tests
npm install
npx playwright install
npm test
```

---

## Estructura del Estado Global (Zustand)

La aplicación utiliza la librería [Zustand](https://zustand-demo.pmnd.rs/) para el manejo del estado global en el frontend. Esto permite compartir y sincronizar el estado entre componentes de manera eficiente y sencilla.

### Stores principales

- **authStore:** Maneja el estado de autenticación del usuario, incluyendo:
   - Usuario autenticado y su información
   - Token de sesión
   - Métodos para login, logout, registro
   - Métodos para agregar/quitar películas de favoritos y lista de ver después

- **moviesStore:** Gestiona el listado global de películas, su estado de carga y errores. Permite que las páginas y componentes accedan a la lista de películas y la mantengan sincronizada sin recargar desde la API en cada vista.

Ambos stores permiten que el estado de usuario y películas esté disponible en cualquier componente React, facilitando la navegación entre páginas y la actualización reactiva de la UI.



## Instrucciones de instalación

Lo primero que se debe hacer es clonar este repositorio.
Tras clonarlo, nos dirigimos a la ruta donde quedó este repo. A continuación se enseñan
las instrucciones tanto del backend como del frontend que permiten correr la aplicación.

### Frontend
- Dirigirse a la carpeta `frontend` (`cd frontend` desde la raíz del repositorio)
- Ejecutar el comando `npm install` para instalar las dependencias necesarias
- Ejecutar el comando `npm install axios`
- Ejecutar el comando `npm install react-router-dom`
- Ejecutar la aplicación utilizando el comando `npm run build` + `npm run preview`
- Entrar a la dirección indicadad en la consola (defecto puerto 4173)
- Navegar a través de la aplicación

### Backend
- Dirigirse a la carpeta `backend` (`cd backend` desde la raíz del repositorio)
- Ejecutar el comando `npm install json-server --save-dev`
- Ejecutar mediante comando `npm run api`

# Configuración y ejecución del backend 2.0

## Requisitos
- Node.js ≥ 18  
- MongoDB instalado localmente (desde la página oficial, Homebrew o Docker)  
- npm (incluido con Node)

---

## Clonar el proyecto e instalar dependencias

```bash
git clone <URL-del-repo>
cd backend
npm install
```

## Iniciar MongoDB

Cada integrante debe crear su propia carpeta de datos local (fuera del repo) y ejecutar Mongo manualmente.

### Crear carpeta de datos
```
mkdir -p ~/data/db
```

### Iniciar Mongo (mantén esta terminal abierta)
```
mongod --dbpath ~/data/db
```
Cuando veas Waiting for connections on port 27017, significa que Mongo está corriendo correctamente.

## Crear el archivo .env en la carpeta /backend
```
MONGODB_URI=mongodb://127.0.0.1:27017/moviesdb
PORT=4000
```
Usa 127.0.0.1 (no localhost) para evitar problemas con IPv6.

## Ejecutar el servidor backend

En otra terminal (sin cerrar mongod):
```
npm run dev
```

Deberías ver:
```
Conectado a MongoDB
Servidor corriendo en http://localhost:4000
```

Para probar:
```
curl http://localhost:4000/api/health
```

## Poblar la base de datos (opcional, para cargar las películas)

Este comando lee el archivo db.json del proyecto y lo inserta en Mongo.

### Cargar todo desde cero (borra los datos anteriores)
```
npm run seed
```
### O bien actualizar/insertar (sin borrar)
```
npm run seed:upsert
```
Verás en consola algo como:
```
Seed completado (wipe-and-insert). Insertadas: 30
```

## Verificar que los datos se insertaron

Puedes revisar desde el navegador o consola:
```
curl http://localhost:4000/api/movies
```



## Probar Autenticación:
### 1.	Asegúrate de que el backend esté corriendo
En la carpeta backend ejecuta:
```
npm run dev
```
Si todo está bien, debería aparecer algo como:
```
Conectado a MongoDB
Servidor corriendo en http://localhost:4000
```
Importante: mantener el servicio de MongoDB encendido (mongod –dbpath ~/data/db)

### 2.	Crear un usuario de prueba
Copia este comando en la terminal:
```
curl -X POST http://localhost:4000/api/users 
-H “Content-Type: application/json” 
-d ‘{“username”:“carlos”,“name”:“Carlos”,“password”:“secreto123”}’
```
Esto crea un usuario con usuario “carlos” y contraseña “secreto123”.
Si todo sale bien, deberías recibir un JSON con la información del usuario creado (sin contraseña).

### 3.	Iniciar sesión (login)
Usa este comando:
```
curl -i -X POST http://localhost:4000/api/login 
-H “Content-Type: application/json” 
-d ‘{“username”:“carlos”,“password”:“secreto123”}’
```
Observa la respuesta completa:
* En los headers deberías ver una línea que dice algo como:
```
Set-Cookie: token=<un_jwt_largo>; HttpOnly
```
* También debería haber una cabecera:
```
X-CSRF-Token: <un_uuid>
```
Esos dos valores (cookie y token CSRF) son los que usaremos en los siguientes pasos.

### 4.	Verificar sesión activa (endpoint protegido)
Reemplaza en el siguiente comando los valores reales que obtuviste en el paso anterior:
```
curl -i http://localhost:4000/api/login/me 
-H “X-CSRF-Token: <aquí_el_valor_del_token_CSRF>” 
–cookie “token=<aquí_el_valor_del_cookie_token>”
```
Si la autenticación funciona, el servidor responderá con:
```
HTTP/1.1 200 OK
```
y un JSON indicando que la sesión es válida.
Si falta el header o la cookie, deberías obtener un 401 (no autorizado).

### 5.	Probar un endpoint protegido cualquiera
Por ejemplo, en este backend hay una ruta protegida de ejemplo:
```
/api/secure/ping
```
Usa el mismo formato:
```
curl -i http://localhost:4000/api/secure/ping 
-H “X-CSRF-Token: <csrf_token>” 
–cookie “token=<jwt_token>”
```
Si estás logueado correctamente, devuelve algo como:
```
{“ok”:true,“by”:”<id_del_usuario>”}
```
### 6.	Cerrar sesión (logout)
```
curl -X POST http://localhost:4000/api/login/logout
```

Esto limpia la cookie httpOnly y finaliza la sesión.

---

## 🧪 Pruebas E2E (End-to-End)

El proyecto incluye pruebas E2E completas utilizando Playwright que validan el funcionamiento de la aplicación de principio a fin.

### Casos de Prueba Implementados

#### Autenticación y Rutas Protegidas
- Login con credenciales válidas e inválidas
- Registro de nuevos usuarios
- Validación de rutas protegidas
- Cierre de sesión

#### CRUD de Películas
- Listar y buscar películas
- Filtrar por género y plataforma
- Ver detalles de películas
- Crear, editar y eliminar películas
- Agregar a favoritos y lista de "ver después"

### Ejecutar las Pruebas E2E

1. **Asegúrate de tener el backend y frontend corriendo:**
   ```bash
   # Terminal 1: Backend
   cd backend
   npm run dev
   
   # Terminal 2: Frontend (en modo preview)
   cd frontend
   npm run build
   npm run preview
   ```

2. **Instalar dependencias de las pruebas:**
   ```bash
   cd e2e-tests
   npm install
   npx playwright install
   ```

3. **Crear usuario de prueba:**
   ```bash
   curl -X POST http://localhost:4000/api/users \
   -H "Content-Type: application/json" \
   -d '{"username":"testuser","name":"Test User","password":"password123"}'
   ```

4. **Ejecutar las pruebas:**
   ```bash
   # Ejecutar todas las pruebas
   npm test
   
   # Ejecutar en modo UI (interactivo)
   npx playwright test --ui
   
   # Ver el reporte
   npm run test:report
   ```

Para más información sobre las pruebas E2E, consulta el [README de e2e-tests](./e2e-tests/README.md).

