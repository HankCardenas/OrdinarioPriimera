// ===============================================
// Nombre: Items.js - Rutas para el CRUD de Items
// Autor: [Tu Nombre]
// Fecha: 30/05/2025
// Descripción: Este archivo maneja todas las operaciones
//              CRUD (Create, Read, Update, Delete) para
//              los items de Minecraft en la base de datos
// ===============================================

const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

// Conectar a la base de datos
// Usamos path relativo porque este archivo está en la carpeta routes
const db = new sqlite3.Database('./minecraft.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('🎮 Conectado a la base de datos de Minecraft!');
});

// ====== RUTAS DEL API ======

// GET /api/items
// Obtener todos los items del inventario
router.get('/', (req, res) => {
    db.all('SELECT * FROM items', [], (err, rows) => {
        if (err) {
            console.error('Error al obtener items:', err);
            return res.status(500).json({ error: 'Error al obtener items' });
        }
        res.json(rows);
    });
});

// POST /api/items
// Crear un nuevo item en el inventario
router.post('/', (req, res) => {
    const { name, quantity, type } = req.body;
    
    // Validar datos recibidos
    if (!name || !quantity) {
        return res.status(400).json({ 
            error: 'Se requiere nombre y cantidad' 
        });
    }

    const sql = 'INSERT INTO items (name, quantity, type) VALUES (?, ?, ?)';
    db.run(sql, [name, quantity, type], function(err) {
        if (err) {
            console.error('Error al crear item:', err);
            return res.status(500).json({ error: 'Error al crear item' });
        }
        
        res.status(201).json({
            id: this.lastID,
            name,
            quantity,
            type
        });
    });
});

// PUT /api/items/:id
// Actualizar un item existente
router.put('/:id', (req, res) => {
    const { name, quantity, type } = req.body;
    const { id } = req.params;

    console.log('📝 Intentando actualizar item:', { id, name, quantity, type });

    // Validar datos recibidos
    if (!name && !quantity && !type) {
        return res.status(400).json({ 
            error: 'Se requiere al menos un campo para actualizar' 
        });
    }

    const sql = 'UPDATE items SET name = ?, quantity = ? WHERE id = ?';
    console.log('🔍 Consulta SQL:', sql);
    console.log('📊 Valores:', [name, quantity, id]);

    db.run(sql, [name, quantity, id], function(err) {
        if (err) {
            console.error('❌ Error al actualizar item:', err);
            return res.status(500).json({ error: 'Error al actualizar item' });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Item no encontrado' });
        }

        console.log('✅ Item actualizado con éxito:', { id, name, quantity, type });
        res.json({ id, name, quantity, type });
    });
});

// DELETE /api/items/:id
// Eliminar un item del inventario
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM items WHERE id = ?', id, function(err) {
        if (err) {
            console.error('Error al eliminar item:', err);
            return res.status(500).json({ error: 'Error al eliminar item' });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Item no encontrado' });
        }
        
        res.json({ message: 'Item eliminado con éxito' });
    });
});

module.exports = router;
