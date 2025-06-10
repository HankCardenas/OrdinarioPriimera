const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Habilitar CORS y JSON parsing
app.use(cors());
app.use(express.json());

// Middleware para logging
app.use((req, res, next) => {
  console.log('Petición recibida:', {
    método: req.method,
    ruta: req.path,
    cuerpo: req.body
  });
  next();
});

// Lista de monedas disponibles
const MONEDAS_DISPONIBLES = [
  { codigo: "USD", nombre: "Dólar Estadounidense" },
  { codigo: "EUR", nombre: "Euro" },
  { codigo: "MXN", nombre: "Peso Mexicano" },
  { codigo: "GBP", nombre: "Libra Esterlina" },
  { codigo: "JPY", nombre: "Yen Japonés" },
  { codigo: "CAD", nombre: "Dólar Canadiense" },
  { codigo: "AUD", nombre: "Dólar Australiano" },
  { codigo: "CHF", nombre: "Franco Suizo" },
  { codigo: "CNY", nombre: "Yuan Chino" },
  { codigo: "ARS", nombre: "Peso Argentino" },
  { codigo: "BRL", nombre: "Real Brasileño" },
  { codigo: "CLP", nombre: "Peso Chileno" },
  { codigo: "COP", nombre: "Peso Colombiano" },
  { codigo: "PEN", nombre: "Sol Peruano" }
];

// Función para obtener tasa de cambio real
async function obtenerTasaDeCambio(monedaOrigen, monedaDestino) {
  try {
    const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${monedaOrigen}`);
    const tasas = response.data.rates;
    return tasas[monedaDestino];
  } catch (error) {
    console.error('Error al obtener tasa de cambio:', error);
    throw new Error('No se pudo obtener la tasa de cambio');
  }
}

// Ruta raíz para verificar que el servidor funciona
app.get('/', (req, res) => {
  res.json({ mensaje: 'Servidor funcionando correctamente' });
});

// Ruta para obtener monedas disponibles
app.get('/monedas', async (req, res) => {
  try {
    // Obtener todas las tasas para USD como base
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
    const tasas = response.data.rates;
    
    // Crear lista de conversiones disponibles
    const conversiones = [];
    MONEDAS_DISPONIBLES.forEach(monedaOrigen => {
      MONEDAS_DISPONIBLES.forEach(monedaDestino => {
        if (monedaOrigen.codigo !== monedaDestino.codigo) {
          // Calcular tasa de cambio relativa
          const tasaOrigen = tasas[monedaOrigen.codigo];
          const tasaDestino = tasas[monedaDestino.codigo];
          const tasaRelativa = tasaDestino / tasaOrigen;
          
          conversiones.push({
            id: `${monedaOrigen.codigo}-${monedaDestino.codigo}`,
            origen: monedaOrigen.codigo,
            destino: monedaDestino.codigo,
            valor: tasaRelativa
          });
        }
      });
    });
    
    res.json(conversiones);
  } catch (error) {
    console.error('Error al obtener tasas:', error);
    res.status(500).json({ error: 'Error al obtener tasas de cambio' });
  }
});

// Ruta para convertir
app.post('/convertir', async (req, res) => {
  const { cantidad, origen, destino } = req.body;
  console.log('Datos recibidos:', { cantidad, origen, destino });

  // Validar datos
  if (!cantidad || !origen || !destino) {
    return res.status(400).json({
      error: 'Datos incompletos',
      recibido: { cantidad, origen, destino }
    });
  }

  try {
    // Obtener tasa de cambio real
    const tasa = await obtenerTasaDeCambio(origen, destino);
    const resultado = cantidad * tasa;

    // Enviar resultado
    res.json({
      resultado,
      detalles: {
        cantidad,
        origen,
        destino,
        tasa
      }
    });
  } catch (error) {
    console.error('Error en la conversión:', error);
    res.status(500).json({ error: 'Error al realizar la conversión' });
  }
});

// Capturar rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    ruta: req.path,
    método: req.method
  });
});

// Iniciar servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log('Rutas disponibles:');
  console.log('- GET  /');
  console.log('- GET  /monedas');
  console.log('- POST /convertir');
  console.log('\nMonedas disponibles:');
  MONEDAS_DISPONIBLES.forEach(moneda => {
    console.log(`- ${moneda.codigo}: ${moneda.nombre}`);
  });
}); 