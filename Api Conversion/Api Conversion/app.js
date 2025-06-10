require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const monedas = require('./monedas');
const { Op } = require('sequelize');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const puerto = process.env.PORT || 3000;

// Configuración de seguridad
app.use(helmet());

// Configuración de rate limiting
const limiter = rateLimit({
    windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 minutos por defecto
    max: process.env.RATE_LIMIT_MAX || 100 // límite de 100 peticiones por ventana
});
app.use(limiter);

// Configuración de CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS ? 
    process.env.ALLOWED_ORIGINS.split(',') : 
    ['http://localhost:3000'];

app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    }
}));

app.use(bodyParser.json());

// Middleware de validación
const validarMoneda = (req, res, next) => {
    const { origen, destino, valor } = req.body;
    
    if (!origen || typeof origen !== 'string' || origen.length > 10) {
        return res.status(400).json({ error: 'Moneda de origen inválida' });
    }
    if (!destino || typeof destino !== 'string' || destino.length > 10) {
        return res.status(400).json({ error: 'Moneda de destino inválida' });
    }
    if (!valor || typeof valor !== 'number' || valor <= 0) {
        return res.status(400).json({ error: 'Valor de conversión inválido' });
    }
    
    next();
};

// Middleware para manejar errores
app.use((err, req, res, next) => {
    console.error(new Date().toISOString(), err.name, err.message);
    
    if (err.message === 'No permitido por CORS') {
        return res.status(403).json({ error: 'Origen no permitido' });
    }
    
    res.status(500).json({ 
        error: process.env.NODE_ENV === 'production' ? 
            'Error interno del servidor' : 
            err.message 
    });
});

// Ruta principal
app.get('/', (req, res) => {
    res.json({
        mensaje: 'API de Conversión de Monedas',
        endpoints: {
            obtenerMonedas: 'GET /monedas',
            agregarMoneda: 'POST /monedas',
            editarMoneda: 'PUT /monedas/:id',
            convertir: 'POST /convertir'
        }
    });
});

// Obtener todas las monedas
app.get('/monedas', async (req, res) => {
    try {
        const data = await monedas.findAll();
        res.json(data);
    } catch (error) {
        next(error);
    }
});

// Realizar conversión
app.post('/convertir', async (req, res, next) => {
    try {
        const { origen, destino, cantidad } = req.body;
        
        if (!origen || !destino || !cantidad || cantidad <= 0) {
            return res.status(400).json({ 
                error: 'Todos los campos son requeridos y la cantidad debe ser mayor a 0' 
            });
        }

        const data = await monedas.findOne({
            where: {
                [Op.and]: [{ origen }, { destino }],
            }
        });

        if (!data) {
            return res.status(404).json({ 
                error: 'Par de conversión no encontrado',
                sugerencia: 'Verifica que las monedas existan en el sistema' 
            });
        }

        const { valor } = data;
        const resultado = Number((cantidad * valor).toFixed(4));

        res.json({
            origen,
            destino,
            cantidad,
            resultado,
            tasa: valor,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        next(error);
    }
});

// Agregar nueva moneda
app.post('/monedas', validarMoneda, async (req, res, next) => {
    try {
        const { origen, destino, valor } = req.body;
        
        const existente = await monedas.findOne({
            where: {
                [Op.and]: [{ origen }, { destino }],
            }
        });

        if (existente) {
            return res.status(409).json({ 
                error: 'Esta conversión ya existe',
                sugerencia: 'Usa PUT para actualizar el valor' 
            });
        }

        const nuevaMoneda = await monedas.create({
            origen,
            destino,
            valor
        });

        res.status(201).json(nuevaMoneda);
    } catch (error) {
        next(error);
    }
});

// Editar moneda existente
app.put('/monedas/:id', validarMoneda, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { origen, destino, valor } = req.body;

        const moneda = await monedas.findByPk(id);

        if (!moneda) {
            return res.status(404).json({ error: 'Moneda no encontrada' });
        }

        const actualizada = await moneda.update({
            origen,
            destino,
            valor
        });

        res.json({
            mensaje: 'Moneda actualizada correctamente',
            data: actualizada
        });
    } catch (error) {
        next(error);
    }
});

// Iniciar el servidor
app.listen(puerto, () => {
    console.log(`Servidor iniciado en http://localhost:${puerto}`);
    console.log('Modo:', process.env.NODE_ENV || 'desarrollo');
}); 