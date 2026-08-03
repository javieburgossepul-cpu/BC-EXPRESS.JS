# Proyecto Semana 01 - Procesador de Datos con Node.js
## Descripción del proyecto
Este proyecto consiste en crear un programa que permita organizar y procesar información de un museo mediante una herramienta de consola.
El programa trabaja con un listado de obras de arte, donde se puede consultar información como la cantidad de obras registradas, cuáles se encuentran en exhibición, sus precios y las categorías disponibles.
El objetivo de esta práctica es aprender a manejar información, procesarla y generar reportes con los datos obtenidos.
---
# Dominio del proyecto: Museo
## Recurso principal: Obras de Arte
Para este proyecto se adaptó el recurso inicial llamado "Item" al dominio de un museo, cambiándolo por "Obra de Arte".
Cada obra contiene información como:
* Nombre de la obra.
* Artista.
* Categoría.
* Precio.
* Estado de exhibición.
Las categorías utilizadas son:
* Painting.
* Sculpture.
---
# Funcionamiento del programa
El programa realiza las siguientes acciones:
## Lectura de obras
Carga la información de las obras desde un archivo donde se encuentran almacenados los datos del museo.
## Resumen del catálogo
Muestra información general de las obras:
* Total de obras registradas.
* Obras en exhibición.
* Obras fuera de exhibición.
* Precio promedio.
* Obra con mayor precio.
* Obra con menor precio.
* Categorías disponibles.
## Filtro por categoría
Permite consultar las obras de una categoría específica utilizando un filtro.
Ejemplo:
```bash
pnpm dev -- --category Painting
```
Esto muestra únicamente las obras pertenecientes a la categoría seleccionada.
Si la categoría no existe, el programa muestra un mensaje indicando el error y las categorías disponibles.
## Generación del reporte
Después de procesar la información, el programa crea un archivo con los resultados obtenidos.
El reporte se guarda en:
```
output/report.json
```
---
# Ejecución del proyecto
Instalar dependencias:
```bash
pnpm install
```
Ejecutar el programa:
```bash
pnpm dev
```
Ejecutar utilizando un filtro:
```bash
pnpm dev -- --category Painting
```
Comprobar compilación del proyecto:
```bash
pnpm build
```
---
# Resultado del proyecto
El programa permite organizar la información de las obras de un museo, facilitando la consulta de datos y la generación de reportes a partir de la información almacenada.
---
# Información de la actividad
Programa: Node.js Fundamentals
Proyecto: Semana 01 - Procesador de Datos con Node.js
Dominio: Museo
Recurso: Obras de Arte
