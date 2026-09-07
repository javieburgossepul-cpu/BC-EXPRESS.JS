# Proyecto Semana 02 — API REST de Obras de Arte

## Descripción

Este proyecto consiste en una API REST desarrollada con Express y TypeScript para gestionar obras de arte de un museo.

La API permite realizar operaciones CRUD sobre las obras de arte, utilizando un almacenamiento temporal en memoria.

## Dominio

**Museo**

### Recurso principal

**Obra de arte**

Cada obra contiene:

- `id`: identificador de la obra.
- `titulo`: título de la obra.
- `artista`: nombre del artista.
- `año`: año de creación.
- `sala`: sala donde se encuentra la obra.

## Tecnologías utilizadas

- Node.js
- Express 5
- TypeScript
- pnpm
- Git
- Git Bash
 
## Pruebas de proyecto

1. Consultar todos los elementos
Con esta prueba pude ver todos los elementos que estaban guardados en la API.

![Prueba de consultar todos los elementos](./0-assets/prueba1.jpeg)

2. Buscar un elemento por ID
En esta prueba busqué un elemento específico usando su número de ID. Esto permite consultar solamente un registro.

![Prueba de búsqueda por ID](./0-assets/prueba2.jpeg)

3. Crear un nuevo elemento
Aquí probé la creación de un nuevo elemento. Se enviaron los datos y la API respondió mostrando el elemento creado.

![Prueba de creación de un elemento](./0-assets/prueba3.jpeg)

4. Actualizar un elemento
En esta prueba modifiqué la información de un elemento que ya estaba registrado. Después de hacer el cambio, se mostró la información actualizada.

![Prueba de actualización](./0-assets/prueba4.jpeg)

5. Eliminar un elemento
Finalmente probé la opción de eliminar un elemento. La prueba permitió comprobar que el registro podía ser eliminado correctamente.

![Prueba de eliminación](./0-assets/prueba5.jpeg)

## Estructura del proyecto

```text
├── 0-assets/
│   ├── prueba1.jpeg
│   ├── prueba2.jpeg
│   ├── prueba3.jpeg
│   ├── prueba4.jpeg
│   └── prueba5.jpeg
│
├── src/
│   ├── routes/
│   │   └── items.routes.ts
│   ├── app.ts
│   ├── server.ts
│   ├── store.ts
│   └── types.ts
│
├── .env.example
├── .gitignore
├── package.json
├── pnpm-lock.yaml
├── README.md
└── tsconfig.json
