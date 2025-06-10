// ===============================================

// Descripción: Servidor Express para gestionar el inventario 
// de Minecraft. Maneja las rutas y la conexión
//    con la base de datos.
// ===============================================

// Importar las dependencias necesarias
const express = require('express');  // Framework web
const cors = require('cors');        // Middleware para permitir peticiones CORS
const itemsRouter = require('./routes/items');  // Router para los endpoints de items

// Crear la aplicación Express
const app = express();
const port = 3001;  // Puerto en el que escuchará el servidor

// Configurar middlewares
// CORS es necesario para que el frontend pueda hacer peticiones
app.use(cors());
// express.json() es necesario para poder recibir datos en formato JSON
app.use(express.json());

// Configurar las rutas
// Todas las rutas que empiecen con /api/items serán manejadas por itemsRouter
app.use('/api/items', itemsRouter);

// Ruta básica para probar que el servidor está funcionando
app.get('/', (req, res) => {
    res.json({ 
        message: 'Welcome to the Minecraft Inventory Server!',
        endpoints: {
            items: '/api/items',
            docs: 'Documentación de la API:',
            methods: {
                GET: '/api/items - Obtener todos los items',
                POST: '/api/items - Crear un nuevo item',
                PUT: '/api/items/:id - Actualizar un item',
                DELETE: '/api/items/:id - Eliminar un item'
            }
        }
    });
});

// Middleware para manejar errores
// Este middleware se ejecutará cuando ocurra un error en cualquier ruta
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: err.message 
    });
});

// Iniciar el servidor
app.listen(port, (err) => {
    if (err) {
        console.error('Error starting server:', err);
        return;
    }
    console.log(`🎮 Server is running on http://localhost:${port}`);
    console.log('🎯 API endpoints available at http://localhost:3001/api/items');
}); 