#  Proyecto Semana 09: Testing de API REST — Museo de Arte

Suite de pruebas integral para la API REST del dominio **Museo (Inventario de Obras de Arte)**. Implementa pruebas unitarias para la lógica de negocio en servicios con aislamiento mediante mocks, pruebas de integración completas para las rutas HTTP utilizando **Supertest** y **MongoDB Memory Server**, y alcanza una cobertura de código superior al **80%** con **Jest**.

---

##  1. Dominio Asignado y Recurso Principal

* **Dominio Asignado:** Museo de Arte
* **Recurso Principal:** `Obras de Arte` (`/api/v1/obras` y `/api/v1/items`)
* **Recurso de Usuarios:** `User` (`/api/v1/auth`)
* **Base de Datos:** MongoDB (y MongoDB Memory Server para testing)

###  Especificaciones del Modelo de Obra de Arte

| Campo | Tipo | Requerido | Descripción / Reglas de Validación |
| :--- | :--- | :---: | :--- |
| `titulo` | `String` | Sí | Nombre o título de la obra de arte (mínimo 2 caracteres, máximo 200). |
| `codigo` | `String` | Sí | Código de inventario único del museo (mínimo 3 caracteres, ej: `MUS-001`). |
| `año` | `Number` | Sí | **Año** de creación de la obra (número entero positivo entre 0 y 2100, ej: `1503`). |
| `tecnica` | `String` | Sí | Técnica, medio o material artístico (mínimo 2 caracteres, ej: `Óleo sobre lienzo`). |
| `valorEstimado` | `Number` | Sí | Valor de tasación estimado en catálogo en USD (número mayor o igual a 0). |
| `estaExhibida` | `Boolean` | No | Estado de exhibición: `true` si está en exhibición, `false` en depósito (por defecto `true`). |
| `createdBy` | `String` | Sí | Identificador del usuario (Curador o Administrador) que registró la obra. |
| `createdAt` | `Date` | Auto | Marca de tiempo de registro en la base de datos. |
| `updatedAt` | `Date` | Auto | Marca de tiempo de la última modificación. |

---

##  2. Arquitectura y Estructura del Proyecto

```
src/
├── app.ts                         # Configuración de Express, middlewares y rutas
├── server.ts                      # Punto de entrada y arranque del servidor
├── config/
│   └── env.ts                     # Variables de entorno tipadas
├── controllers/
│   ├── auth.controller.ts         # Controladores de registro y login
│   └── items.controller.ts        # Controladores CRUD para Obras de Arte
├── errors/
│   └── AppError.ts                # Clase personalizada para errores HTTP operacionales
├── middlewares/
│   ├── auth.middleware.ts         # Middleware de autenticación JWT y autorización
│   └── error.middleware.ts        # Middleware global de captura de errores y ZodError
├── models/
│   ├── item.model.ts              # Modelo Mongoose de Obra de Arte (con campo año)
│   └── user.model.ts              # Modelo Mongoose de Usuario
├── repositories/
│   ├── items.repository.ts        # Capa de persistencia para Obras de Arte
│   └── users.repository.ts        # Capa de persistencia para Usuarios
├── routes/
│   ├── auth.routes.ts             # Rutas /api/v1/auth
│   └── items.routes.ts            # Rutas /api/v1/items y /api/v1/obras
├── services/
│   ├── auth.service.ts            # Lógica de autenticación y hashing
│   └── items.service.ts           # Lógica de negocio y RBAC de Obras de Arte
├── types/
│   └── index.ts                   # DTOs e interfaces del dominio Museo
├── utils/
│   └── jwt.ts                     # Firma y verificación de tokens JWT
├── validators/
│   ├── auth.schema.ts             # Esquemas de validación Zod para Auth
│   └── items.schema.ts            # Esquemas de validación Zod para Obra de Arte
└── __tests__/
    ├── auth.service.test.ts       # Unit tests de autenticación
    ├── items.service.test.ts      # Unit tests de Obras de Arte (Mocks de repositorio)
    └── items.routes.test.ts       # Integration tests de Rutas (Supertest + MongoMemoryServer)
```

---

##  3. Suite de Pruebas Implementada

### A. Unit Tests — Servicio de Obras de Arte (`__tests__/items.service.test.ts`)
Pruebas unitarias en **aislamiento total** mockeando `items.repository.ts`:

1. **`getAll()`:**
   * Retorna todas las obras de arte cuando existen registros (*happy path*).
   * Retorna un arreglo vacío `[]` cuando no hay obras registradas.
2. **`getById()`:**
   * Retorna la obra de arte correspondiente cuando el ID existe.
   * Lanza `AppError(404)` cuando la obra no existe en el inventario.
3. **`create()`:**
   * Crea y retorna la nueva obra con datos válidos y el campo **`año`**.
   * Lanza `AppError(409)` si el código de inventario ya está registrado.
4. **`update()`:**
   * Actualiza y retorna la obra cuando el solicitante es el curador creador (*dueño*).
   * Actualiza la obra cuando el solicitante tiene rol `admin`.
   * Lanza `AppError(403)` si un curador no dueño intenta modificar la obra.
   * Lanza `AppError(404)` si la obra a actualizar no existe.
   * Lanza `AppError(409)` si el nuevo código entra en conflicto con otra obra existente.
5. **`remove()`:**
   * Elimina la obra cuando el solicitante es el curador creador (*dueño*).
   * Elimina la obra cuando el solicitante tiene rol `admin`.
   * Lanza `AppError(403)` si el solicitante no es dueño ni administrador.
   * Lanza `AppError(404)` si la obra a eliminar no existe.

---

### B. Integration Tests — Rutas de la API (`__tests__/items.routes.test.ts`)
Pruebas de integración HTTP de ciclo completo con **Supertest** y **MongoDB Memory Server**:

1. **`GET /api/v1/items`** → `200 OK` con arreglo vacío inicialmente y con listado tras inserción.
2. **`POST /api/v1/items`** → `201 Created` al enviar payload válido con campo **`año`** y token Bearer.
3. **`POST /api/v1/items`** → `401 Unauthorized` al intentar crear sin token.
4. **`POST /api/v1/items`** → `422 Unprocessable Entity` al enviar datos inválidos que fallan el esquema Zod.
5. **`GET /api/v1/items/:id`** → `200 OK` con los datos de la obra existente.
6. **`GET /api/v1/items/:id`** → `404 Not Found` cuando el ID no existe en la base de datos.
7. **`PUT /api/v1/items/:id`** → `200 OK` cuando el curador dueño actualiza su obra.
8. **`PUT /api/v1/items/:id`** → `403 Forbidden` cuando otro usuario intenta modificar una obra ajena.
9. **`DELETE /api/v1/items/:id`** → `204 No Content` cuando el dueño o admin eliminan la obra.
10. **`DELETE /api/v1/items/:id`** → `403 Forbidden` cuando un usuario no autorizado intenta eliminar la obra.

---

### C. Auth Unit Tests (`__tests__/auth.service.test.ts`)
Pruebas unitarias para el servicio de autenticación con mocks de `users.repository` y `bcryptjs`:
* `register()`: Registro exitoso con contraseña cifrada y rechazo `409` por email duplicado.
* `login()`: Retorno de `accessToken` con credenciales válidas y rechazo `401` por usuario inexistente o contraseña inválida.
* `getMe()`: Retorno del perfil seguro sin campo contraseña y rechazo `404` por usuario inexistente.

---

##  4. Criterios y Umbrales de Cobertura (Coverage)

Configurados en [jest.config.ts](file:///c:/Users/JAVIER%20SEPULVEDA/OneDrive/Desktop/bc-expressjs%20dominio/jest.config.ts):

| Métrica | Umbral Mínimo Requerido |
| :--- | :---: |
| **Statements** | **80%** |
| **Branches** | **70%** |
| **Functions** | **80%** |
| **Lines** | **80%** |

---

##  5. Comandos para Ejecutar la Suite de Pruebas

```bash
# 1. Instalar dependencias
pnpm install

# 2. Ejecutar todos los tests (Unitarios + Integración)
pnpm test

# 3. Ejecutar tests en modo observador (Watch Mode)
pnpm test:watch

# 4. Generar reporte completo de cobertura de código
pnpm test:coverage
```

---


