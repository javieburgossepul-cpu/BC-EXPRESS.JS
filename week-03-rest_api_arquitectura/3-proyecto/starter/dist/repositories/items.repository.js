"use strict";
// ============================================
// REPOSITORY — Capa de acceso a datos
// ============================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAll = findAll;
exports.findById = findById;
exports.create = create;
exports.update = update;
exports.remove = remove;
// Datos iniciales del museo
const store = [
    {
        id: 1,
        titulo: 'La Gioconda',
        artista: 'Leonardo da Vinci',
        año: 1503,
        sala: 'Sala 1',
    },
    {
        id: 2,
        titulo: 'La Noche Estrellada',
        artista: 'Vincent van Gogh',
        año: 1889,
        sala: 'Sala 2',
    },
    {
        id: 3,
        titulo: 'Guernica',
        artista: 'Pablo Picasso',
        año: 1937,
        sala: 'Sala 3',
    },
    {
        id: 4,
        titulo: 'El Grito',
        artista: 'Edvard Munch',
        año: 1893,
        sala: 'Sala 4',
    },
];
let nextId = 5;
// Obtener todas las obras
async function findAll() {
    return [...store];
}
// Buscar una obra por ID
async function findById(id) {
    const item = store.find((item) => item.id === id);
    return item ? { ...item } : undefined;
}
// Crear una nueva obra
async function create(dto) {
    const item = {
        id: nextId++,
        ...dto,
    };
    store.push(item);
    return { ...item };
}
// Actualizar una obra
async function update(id, dto) {
    const index = store.findIndex((item) => item.id === id);
    if (index === -1) {
        return undefined;
    }
    store[index] = {
        ...store[index],
        ...dto,
    };
    return { ...store[index] };
}
// Eliminar una obra
async function remove(id) {
    const index = store.findIndex((item) => item.id === id);
    if (index === -1) {
        return false;
    }
    store.splice(index, 1);
    return true;
}
