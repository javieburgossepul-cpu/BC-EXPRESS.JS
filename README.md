# Proyecto Semana 04 - API de Museo de Arte

API para la administracion de obras de arte en un museo. El proyecto incluye validacion de datos de entrada con Zod, control centralizado de errores con una clase personalizada (AppError) y registro de actividad en consola y archivos con Winston y Morgan.

---

## Dominio Asignado

* **Dominio**: Museo de Arte
* **Recurso**: Obras de Arte (`Obra` / `Item`)
* **Ruta principal**: `/api/v1/obras` (tambien disponible en `/api/v1/items`)

### Campos de una Obra

| Campo | Tipo | Obligatorio | Descripcion / Regla |
|---|---|:---:|---|
| id | Numero | No (Automatico) | Identificador unico positivo |
| titulo | Texto | Si | Nombre de la obra |
| artista | Texto | Si | Nombre del creador de la obra |
| anio | Numero | Si | Anio de creacion (entero) |
| sala | Texto | Si | Sala del museo donde se ubica |
| valorEstimado | Numero | Si | Valor comercial (mayor a 0) |
| tecnica | Texto | No | Tecnica usada (por defecto: 'Oleo sobre lienzo') |
| disponible | Booleano | No | Si esta disponible para exhibicion (por defecto: true) |
| createdAt | Fecha | No (Automatico) | Fecha de registro en el sistema |

---

## Endpoints Disponibles

| Metodo | Ruta | Descripcion | Codigo Exitoso |
|---|---|---|:---:|
| GET | `/health` | Estado del servidor | 200 OK |
| GET | `/api/v1/obras` | Obtener todas las obras (soporta `?page=1&limit=10`) | 200 OK |
| GET | `/api/v1/obras/:id` | Obtener una obra por su ID | 200 OK |
| POST | `/api/v1/obras` | Crear una nueva obra | 201 Created |
| PUT | `/api/v1/obras/:id` | Actualizar una obra existente | 200 OK |
| DELETE | `/api/v1/obras/:id` | Eliminar una obra por su ID | 204 No Content |

---

## Manejo de Errores

El sistema devuelve respuestas estandarizadas en formato JSON ante cualquier error:

### 1. Datos invalidos al crear o actualizar (HTTP 400)
Se genera cuando faltan campos requeridos o tienen un tipo incorrecto:
```json
{
  "error": "Validation Error",
  "message": "Datos de entrada inválidos",
  "issues": [
    { "field": "titulo", "message": "El título es obligatorio" },
    { "field": "valorEstimado", "message": "El valor estimado debe ser mayor a 0" }
  ]
}
```

### 2. ID no numerico en la URL (HTTP 400)
Se genera al consultar por ejemplo `/api/v1/obras/abc`:
```json
{
  "error": "Validation Error",
  "message": "Parámetro id inválido",
  "issues": [
    { "field": "id", "message": "El id debe ser un número positivo" }
  ]
}
```

### 3. Obra no encontrada (HTTP 404)
Se genera al buscar un ID que no existe en el sistema:
```json
{
  "error": "Not Found",
  "message": "Obra con id 999 no encontrada"
}
```

### 4. Ruta inexistente (HTTP 404)
Se genera al acceder a una ruta no registrada:
```json
{
  "error": "Not Found",
  "message": "Ruta GET /ruta-inexistente no encontrada"
}
```

---

## Consultas de Prueba

Puedes probar los endpoints con los siguientes comandos en tu terminal:

### 1. Peticion POST con datos invalidos (Genera Error 400)
```bash
curl -X POST http://localhost:3000/api/v1/obras \
  -H "Content-Type: application/json" \
  -d '{"titulo":"","artista":"","anio":"texto","valorEstimado":-10}'
```

### 2. Peticion GET con ID no numerico (Genera Error 400)
```bash
curl -X GET http://localhost:3000/api/v1/obras/abc
```

### 3. Peticion GET con ID que no existe (Genera Error 404)
```bash
curl -X GET http://localhost:3000/api/v1/obras/999
```

### 4. Peticion a ruta no existente (Genera Error 404)
```bash
curl -X GET http://localhost:3000/ruta-inexistente
```

### 5. Peticion POST exitosa (Genera 201 Created y logs en consola)
```bash
curl -X POST http://localhost:3000/api/v1/obras \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Las Meninas",
    "artista": "Diego Velazquez",
    "anio": 1656,
    "sala": "Sala Principal",
    "valorEstimado": 450000000,
    "tecnica": "Oleo sobre lienzo",
    "disponible": true
  }'
```

---

## Pruebas Realizadas

### 1. Peticion POST con Body Invalido -> Error 400 con issues[]
<img src="./0-assets/cap1.png" alt="Prueba POST Invalido" width="800">

---

### 2. Peticion GET con ID no numerico -> Error 400
<img src="./0-assets/cap2.png" alt="Prueba ID no numerico" width="800">

---

### 3. Peticion GET con ID inexistente -> Error 404
<img src="./0-assets/cap3.png" alt="Prueba ID inexistente" width="800">

---

### 4. Peticion a Ruta Inexistente -> Error 404 en formato JSON
<img src="./0-assets/cap4.png" alt="Prueba Ruta inexistente" width="800">

---

### 5. Peticion POST Exitosa y Registro de Logs en Consola
<img src="./0-assets/cap5.png" alt="Prueba POST Exitoso y Logs" width="800">

---

## Como Ejecutar el Proyecto

### 1. Instalar dependencias
```bash
pnpm install
```

### 2. Iniciar servidor en modo desarrollo
```bash
pnpm dev
```
El servidor se ejecutara en: `http://localhost:3000`

### 3. Compilar e iniciar en modo produccion
```bash
pnpm build
pnpm start
```
