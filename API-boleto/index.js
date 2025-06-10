/**
 * @fileoverview Servidor Express para la Calculadora de Boletos
 * Este archivo contiene toda la lógica del backend para calcular precios de boletos
 * 
 * @requires express - Framework web para Node.js
 * @version 1.0.0
 */

// Importamos Express usando require (sintaxis CommonJS)
// const es una declaración de variable que no puede ser reasignada
const express = require('express');

// Creamos una nueva instancia de la aplicación Express
// app contendrá todos los métodos y configuraciones de nuestro servidor
const app = express();

// Definimos el puerto donde correrá el servidor
// PORT es una constante numérica que define el puerto de escucha
const PORT = 3000;

 
app.use(express.json()); // Permite recibir datos JSON en el body de las peticiones
app.use(express.static('public')); // Sirve los archivos de la carpeta public

/**
 * Objeto que define los precios base por sección
 * @constant {Object} precios
 * @property {number} A - Precio sección económica ($300)
 * @property {number} B - Precio sección media ($490)
 * @property {number} C - Precio sección preferente ($670)
 * @property {number} D - Precio sección VIP ($899)
 */
const precios = {
    A: 300, // Precio en pesos mexicanos
    B: 490,
    C: 670,
    D: 899
};

/**
 * Calcula el precio final de los boletos aplicando descuentos correspondientes
 * 
 * @function calcularPrecio
 * @param {string} seccion - Identificador de la sección (A, B, C o D)
 * @param {number} cantidad - Número de boletos a comprar
 * @param {string} dia - Día de la función (viernes, sabado o domingo)
 * @returns {Object} Objeto con el resultado o mensaje de error
 * 
 * @example
 * // Retorna { seccion: 'A', cantidad: 2, dia: 'domingo', total: '478.80' }
 * calcularPrecio('A', 2, 'domingo')
 */
function calcularPrecio(seccion, cantidad, dia) {
    // Convertimos la sección a mayúsculas y obtenemos el precio base
    const precioUnitario = precios[seccion.toUpperCase()];
    
    // Validación de sección
    if (!precioUnitario) {
        return { error: 'Sección inválida.' };
    }

    // Array con los días válidos para validación
    const diasValidos = ['viernes', 'sabado', 'domingo'];
    
    // Validación de día usando el método includes()
    if (!diasValidos.includes(dia.toLowerCase())) {
        return { error: 'Día inválido.' };
    }

    // Cálculo inicial: precio unitario * cantidad
    let total = precioUnitario * cantidad;

    // Aplicación de descuentos
    if (dia.toLowerCase() === 'domingo') {
        total *= 0.84; // Descuento del 16% (multiplicar por 0.84)
    }

    if (cantidad > 1) {
        total *= 0.95; // Descuento del 5% por cantidad
    }

    // Retornamos objeto con todos los detalles y el total formateado a 2 decimales
    return {
        seccion,
        cantidad,
        dia,
        total: total.toFixed(2) // Método para formatear número a 2 decimales
    };
}

/**
 * Endpoint POST para calcular precio de boletos
 * 
 * @route POST /precio-boleto
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.body - Datos enviados en el cuerpo de la solicitud
 * @param {string} req.body.seccion - Sección seleccionada
 * @param {number} req.body.cantidad - Cantidad de boletos
 * @param {string} req.body.dia - Día seleccionado
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Object} Respuesta JSON con el resultado o error
 */
app.post('/precio-boleto', (req, res) => {
    // Desestructuración de objeto para obtener los valores del body
    const { seccion, cantidad, dia } = req.body;

    // Validación de campos requeridos
    if (!seccion || !cantidad || !dia) {
        // Status 400 indica error del cliente
        return res.status(400).json({ 
            error: 'Faltan parámetros: sección, cantidad o día.' 
        });
    }

    // Llamamos a la función de cálculo
    const resultado = calcularPrecio(seccion, cantidad, dia);

    // Si hay error, respondemos con status 400
    if (resultado.error) {
        return res.status(400).json({ error: resultado.error });
    }

    // Si todo está bien, enviamos el resultado
    res.json(resultado);
});

/**
 * Inicia el servidor HTTP en el puerto especificado
 * 
 * @listens {number} PORT
 * @callback - Función que se ejecuta cuando el servidor inicia
 */
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
