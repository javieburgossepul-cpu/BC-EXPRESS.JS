"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAll = findAll;
exports.findById = findById;
exports.create = create;
exports.update = update;
exports.remove = remove;
// Seed data inicial de obras maestras del museo
const items = [
    {
        id: 1,
        titulo: 'La Gioconda',
        artista: 'Leonardo da Vinci',
        anio: 1503,
        sala: 'Sala 1',
        valorEstimado: 860000000,
        tecnica: 'Óleo sobre tabla de álamo',
        disponible: true,
        createdAt: new Date('2024-01-15T10:00:00Z'),
    },
    {
        id: 2,
        titulo: 'La Noche Estrellada',
        artista: 'Vincent van Gogh',
        anio: 1889,
        sala: 'Sala 2',
        valorEstimado: 100000000,
        tecnica: 'Óleo sobre lienzo',
        disponible: true,
        createdAt: new Date('2024-02-10T11:30:00Z'),
    },
    {
        id: 3,
        titulo: 'Guernica',
        artista: 'Pablo Picasso',
        anio: 1937,
        sala: 'Sala 3',
        valorEstimado: 200000000,
        tecnica: 'Óleo sobre lienzo',
        disponible: true,
        createdAt: new Date('2024-03-05T09:15:00Z'),
    },
    {
        id: 4,
        titulo: 'El Grito',
        artista: 'Edvard Munch',
        anio: 1893,
        sala: 'Sala 4',
        valorEstimado: 120000000,
        tecnica: 'Óleo, temple y pastel sobre cartón',
        disponible: true,
        createdAt: new Date('2024-04-20T14:45:00Z'),
    },
];
let nextId = 5;
/**
 * Obtiene todas las obras registradas
 */
async function findAll() {
    return items.map((item) => ({ ...item }));
}
/**
 * Busca una obra por su ID
 */
async function findById(id) {
    const item = items.find((i) => i.id === id);
    return item ? { ...item } : undefined;
}
/**
 * Registra una nueva obra
 */
async function create(dto) {
    const item = {
        id: nextId++,
        ...dto,
        createdAt: new Date(),
    };
    items.push(item);
    return { ...item };
}
/**
 * Actualiza los datos de una obra existente
 */
async function update(id, dto) {
    const index = items.findIndex((i) => i.id === id);
    if (index === -1)
        return undefined;
    items[index] = {
        ...items[index],
        ...dto,
    };
    return { ...items[index] };
}
/**
 * Elimina una obra por su ID
 */
async function remove(id) {
    const index = items.findIndex((i) => i.id === id);
    if (index === -1)
        return false;
    items.splice(index, 1);
    return true;
}
