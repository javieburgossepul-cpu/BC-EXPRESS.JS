# Proyecto Semana 08: API Segura con RBAC y Capas de Seguridad — Museo de Arte

API REST profesional y robusta para la administración de un **Museo (Inventario de Obras de Arte)**. Implementa **Autenticación JWT** (con tokens de acceso y refresh en cookies HttpOnly y cabeceras Bearer), control de acceso basado en roles (**RBAC** con roles `user` y `admin`), y cinco capas integrales de seguridad HTTP, rate limiting y sanitización contra inyecciones.

---

## 🏛️ 1. Dominio y Recurso Principal

* **Dominio Asignado:** Museo de Arte
* **Recurso Principal:** `Obras de Arte` (`/api/v1/obras` y `/api/v1/items`)
* **Recurso de Usuarios:** `User` (`/api/v1/users` y `/api/v1/auth`)
* **Motor de Base de Datos:** MongoDB con Mongoose

### 📋 Especificaciones del Modelo de Obra de Arte

| Campo | Tipo | Requerido | Descripción / Reglas de Validación |
| :--- | :--- | :---: | :--- |
| `titulo` | `String` | Sí | Nombre o título de la obra de arte (mínimo 2 caracteres, sanitizado contra XSS). |
| `codigo` | `String` | Sí | Código de inventario único del museo (ej: `MUS-001`, en mayúsculas, único). |
| `año` | `Number` | Sí | **Año** de creación de la obra (número entero positivo, ej: `1503`). |
| `tecnica` | `String` | Sí | Técnica, medio o material de la obra (ej: `Óleo sobre lienzo`, `Escultura en mármol`). |
| `valorEstimado` | `Number` | Sí | Valor de tasación estimado en catálogo en USD (número no negativo). |
| `estaExhibida` | `Boolean` | No | Estado de exhibición: `true` si está en sala / galería, `false` si está en depósito o bodega (por defecto `true`). |
| `creadoPor` | `ObjectId` | Sí | Identificador del usuario (Curador o Admin) que dio de alta la obra en el sistema. |
| `createdAt` | `Date` | Auto | Fecha y hora exacta de registro en la base de datos. |
| `updatedAt` | `Date` | Auto | Fecha y hora de la última modificación. |

---

## 🛡️ 2. Control de Acceso Basado en Roles (RBAC)

El sistema define dos roles de usuario:
* **`user` (Curador de Arte):** Puede consultar el catálogo, registrar nuevas obras en el inventario y **editar únicamente las obras creadas por su propio usuario**.
* **`admin` (Administrador General del Museo):** Dispone de privilegios totales; puede registrar obras, editar **cualquier obra** del catálogo y es el **único rol autorizado para eliminar obras** del inventario.

### 📊 Matriz de Permisos

| Endpoint | Método | Acceso / Rol Requerido | Descripción |
| :--- | :---: | :--- | :--- |
| `/api/v1/health` | `GET` | **Público** | Estado de salud y metadatos de la API. |
| `/api/v1/auth/register` | `POST` | **Público** *(Limitado por Rate Limiter)* | Registro de nuevos usuarios / curadores. |
| `/api/v1/auth/login` | `POST` | **Público** *(Limitado por Rate Limiter)* | Inicio de sesión con generación de JWT. |
| `/api/v1/auth/refresh` | `POST` | **Público** *(con Refresh Token válido)* | Renovación de tokens con rotación de secretos. |
| `/api/v1/auth/me` | `GET` | **Autenticado** (`user` o `admin`) | Consulta del perfil y rol del usuario actual. |
| `/api/v1/auth/logout` | `POST` | **Autenticado** (`user` o `admin`) | Cierre de sesión e invalidación del token en BD. |
| `/api/v1/users/dashboard` | `GET` | **Autenticado** (`user` o `admin`) | Panel de control del usuario autenticado. |
| `/api/v1/obras` | `GET` | **Público** | Listado completo de obras de arte del catálogo. |
| `/api/v1/obras/:id` | `GET` | **Público** | Consulta de la ficha técnica de una obra por ID. |
| `/api/v1/obras` | `POST` | **Autenticado** (`user` o `admin`) | Registro de una nueva obra (asigna `creadoPor`). |
| `/api/v1/obras/:id` | `PATCH` | **Autenticado** *(Dueño de la obra O `admin`)* | Actualización de datos de una obra. |
| `/api/v1/obras/:id` | `DELETE` | **Solo Admin** (`admin`) | Eliminación permanente de una obra del catálogo. |

---

## 🔒 3. Capas de Seguridad Implementadas

La API implementa una arquitectura de seguridad por capas en el orden exacto recomendado:

1. **Helmet (Cabeceras de Seguridad HTTP):**
   * Configura cabeceras seguras como `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, y remueve la cabecera `X-Powered-By`.
2. **Rate Limiting Diferenciado (`express-rate-limit`):**
   * **Limitador Global:** 100 solicitudes por cada ventana de 15 minutos en todas las rutas. Retorna cabeceras estándar `RateLimit-Limit`, `RateLimit-Remaining` y `RateLimit-Reset`.
   * **Limitador de Autenticación (`authLimiter`):** 5 intentos por cada 15 minutos en `/api/v1/auth/register` y `/api/v1/auth/login` para mitigar ataques de fuerza bruta y credential stuffing. Retorna código `429 Too Many Requests` al exceder el límite.
3. **CORS con Lista Blanca (Whitelist):**
   * Bloquea orígenes no autorizados y admite solicitudes de orígenes confiables (ej. `http://localhost:5173`, `http://localhost:3000`, `http://localhost:8080`) con soporte para credenciales y métodos `GET, POST, PATCH, DELETE, OPTIONS`.
4. **Sanitización contra Inyecciones NoSQL (`express-mongo-sanitize`):**
   * Remueve caracteres prohibidos como `$` y `.` de cuerpos de petición, query strings y parámetros de ruta antes de llegar a los controladores.
5. **Validación de Entradas y Prevención XSS con Zod:**
   * Valida tipos, longitudes y formatos estrictos. Incorpora expresiones regulares anti-XSS (`/^[^<>]*$/`) para rechazar inyecciones de código HTML/JavaScript.
6. **Manejo Seguro de Errores (`errorHandler`):**
   * Captura errores operacionales (`AppError`), errores de validación (`ZodError`), duplicidad en MongoDB (código 11000) y bloqueos CORS. Oculta los detalles y stack traces cuando se ejecuta en entorno de producción (`NODE_ENV=production`).

---

## 🚀 4. Instrucciones para Ejecutar el Proyecto

### Requisitos Previos
* **Node.js:** Versión `>= 22.0.0`
* **Docker Desktop** (para la base de datos MongoDB)
* **pnpm** (o npm / yarn)

### Paso 1: Levantar la Base de Datos MongoDB en Docker
```bash
docker compose up -d
```

### Paso 2: Configurar las Variables de Entorno
Copia el archivo `.env.example` a `.env` si aún no existe:
```bash
cp .env.example .env
```
Contenido recomendado de `.env`:
```env
PORT=8080
NODE_ENV=development
MONGODB_URI=mongodb://bootcamp:bootcamp123@localhost:27017/bootcamp_auth_dev?authSource=admin
JWT_ACCESS_SECRET=museo_jwt_access_secret_super_key_2026_dev_auth_token_123456
JWT_REFRESH_SECRET=museo_jwt_refresh_secret_super_key_2026_dev_refresh_token_789012
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://localhost:8080
```

### Paso 3: Instalar Dependencias
```bash
pnpm install
```

### Paso 4: Cargar Datos de Prueba (Seed)
Ejecuta el script para poblar usuarios y obras de arte iniciales (con el campo `año`):
```bash
pnpm seed
```

**Credenciales generadas por defecto:**
* **Administrador:** `admin@museo.com` / Contraseña: `Admin1234!` (Rol: `admin`)
* **Curador:** `curador@museo.com` / Contraseña: `User1234!` (Rol: `user`)
* **Usuario de Prueba:** `user@test.com` / Contraseña: `User1234!` (Rol: `user`)

### Paso 5: Iniciar el Servidor en Modo Desarrollo
```bash
pnpm dev
```
El servidor quedará disponible en: `http://localhost:8080`

---

## 🧪 5. Ejemplos de Payloads para Pruebas (Thunder Client / Postman)

### 1. Iniciar Sesión como Curador (`POST /api/v1/auth/login`)
**Body:**
```json
{
  "email": "curador@museo.com",
  "password": "User1234!"
}
```
**Respuesta esperada (200 OK):**
```json
{
  "message": "Inicio de sesión exitoso",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "user",
  "user": {
    "id": "664fa1...",
    "name": "Curador Principal",
    "email": "curador@museo.com",
    "role": "user"
  }
}
```

---

### 2. Crear una Nueva Obra de Arte (`POST /api/v1/obras`)
* **Headers:** `Authorization: Bearer <accessToken>`
* **Body:**
```json
{
  "titulo": "La joven de la perla",
  "codigo": "MUS-005",
  "año": 1665,
  "tecnica": "Óleo sobre lienzo",
  "valorEstimado": 75000000,
  "estaExhibida": true
}
```
**Respuesta esperada (201 Created):**
```json
{
  "message": "Obra de arte registrada exitosamente",
  "data": {
    "_id": "664fa9...",
    "titulo": "La joven de la perla",
    "codigo": "MUS-005",
    "año": 1665,
    "tecnica": "Óleo sobre lienzo",
    "valorEstimado": 75000000,
    "estaExhibida": true,
    "creadoPor": "664fa1...",
    "createdAt": "2026-09-24T19:00:00.000Z",
    "updatedAt": "2026-09-24T19:00:00.000Z"
  }
}
```

---

### 3. Actualizar una Obra (`PATCH /api/v1/obras/:id`)
* **Headers:** `Authorization: Bearer <accessToken>`
* **Body:**
```json
{
  "año": 1666,
  "valorEstimado": 80000000,
  "estaExhibida": false
}
```
* **Caso 1 (Dueño o Admin):** `200 OK` con la obra actualizada.
* **Caso 2 (Otro usuario):** `403 Forbidden` (`"Acceso denegado: Solo puedes modificar las obras creadas por tu usuario o disponer de rol administrador"`).

---

### 4. Eliminar una Obra (`DELETE /api/v1/obras/:id`)
* **Headers:** `Authorization: Bearer <accessToken>`
* **Caso 1 (Usuario rol `user`):** `403 Forbidden` (`"Acceso denegado. Roles requeridos: admin"`).
* **Caso 2 (Usuario rol `admin`):** `200 OK` (`{"message": "Obra de arte eliminada exitosamente del inventario"}`).

---

### 5. Verificación de Headers de Seguridad
Al enviar cualquier petición a `GET /api/v1/obras`, inspecciona las cabeceras de respuesta:
* `X-Content-Type-Options: nosniff` *(Helmet)*
* `RateLimit-Remaining: 99` *(Rate Limiting Global)*
* `Access-Control-Allow-Origin: http://localhost:8080` *(CORS Whitelist)*

---

### 6. Prueba de Rate Limiting en Autenticación
Envía 6 peticiones consecutivas con credenciales incorrectas a `POST /api/v1/auth/login`. En la 6ª petición recibirás:
* **Código:** `429 Too Many Requests`
* **Body:**
```json
{
  "error": "Demasiados intentos de autenticación, por favor intenta nuevamente más tarde"
}
```

---

## 📁 6. Estructura del Proyecto

```
src/
├── app.ts                         # Configuración de Express, middlewares y capas de seguridad
├── server.ts                      # Punto de entrada, conexión a BD e inicio del servidor
├── seed.ts                        # Script de inicialización de datos de prueba
├── config/
│   └── security.ts                # Limitadores de tasa (Rate Limiting) y configuración CORS
├── controllers/
│   ├── auth.controller.ts         # Controladores de registro, login, logout, me y refresh
│   ├── user.controller.ts         # Controlador de panel de usuarios
│   └── obra.controller.ts         # Controlador CRUD para Obras de Arte
├── errors/
│   └── AppError.ts                # Clase personalizada para errores HTTP operacionales
├── lib/
│   └── mongoose.ts                # Conexión y desconexión a la base de datos MongoDB
├── middlewares/
│   ├── auth.middleware.ts         # Middleware de validación JWT (Bearer / Cookies)
│   ├── requireRole.ts             # Middleware de autorización RBAC (requireRole('admin'))
│   ├── errorHandler.ts            # Middleware global de captura y formateo de errores
│   └── notFound.ts                # Middleware para rutas no existentes (404)
├── models/
│   ├── user.model.ts              # Esquema y modelo Mongoose de Usuario
│   ├── obra.model.ts              # Esquema y modelo Mongoose de Obra de Arte
│   └── item.model.ts              # Re-export de compatibilidad
├── repositories/
│   └── users.repository.ts        # Capa de acceso a datos para usuarios
├── routes/
│   ├── auth.routes.ts             # Rutas de autenticación con rate limiting
│   ├── user.routes.ts             # Rutas de perfil y dashboard de usuario
│   ├── obra.routes.ts             # Rutas del recurso Obra con políticas RBAC
│   └── item.routes.ts             # Re-export de compatibilidad
├── schemas/
│   ├── auth.schema.ts             # Esquemas Zod para autenticación
│   ├── obra.schema.ts             # Esquemas Zod para Obra de Arte con campo año
│   └── item.schema.ts             # Re-export de compatibilidad
├── types/
│   └── express.d.ts               # Tipado extendido de Express Request
└── utils/
    └── jwt.ts                     # Utilidades para firma y verificación de tokens JWT
```
