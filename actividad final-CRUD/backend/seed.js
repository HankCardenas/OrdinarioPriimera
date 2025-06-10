// ===============================================
// Nombre: Seed.js - Población de Base de Datos Minecraft
// Autor: [Tu Nombre]
// Fecha: 30/05/2025
// Descripción: Este archivo crea y puebla la base de datos
//              con items del juego Minecraft
// ===============================================

const sqlite3 = require('sqlite3').verbose();

// Paso 1: Conectar a la base de datos SQLite
// Usamos SQLite porque es más fácil que MySQL y no necesita servidor
const db = new sqlite3.Database('./minecraft.db', (err) => {
  if (err) {
    console.error('😢 Error conectando a la base de datos:', err);
    return;
  }
  console.log('🎮 Conectado a la base de datos de Minecraft!');
});

// Paso 2: Definir los items de Minecraft que queremos guardar
// Cada item tiene:
// - name: nombre del item
// - quantity: cantidad máxima que se puede apilar
// - type: tipo de item (arma, herramienta, etc.)
const minecraftItems = [
  // Minerales y Materiales Básicos
  { name: 'Diamante', quantity: 64, type: 'mineral' },
  { name: 'Lingote de Oro', quantity: 64, type: 'mineral' },
  
  // Herramientas
  { name: 'Pico de Hierro', quantity: 1, type: 'herramienta' },
  { name: 'Espada de Diamante', quantity: 1, type: 'arma' },
  
  // Bloques de Construcción
  { name: 'Bloque de Tierra', quantity: 64, type: 'bloque' },
  { name: 'Bloque de Piedra', quantity: 64, type: 'bloque' },
  
  // Items de Supervivencia
  { name: 'Manzana Dorada', quantity: 16, type: 'comida' },
  { name: 'Antorcha', quantity: 64, type: 'iluminación' },
  
  // Items de Almacenamiento y Utilidad
  { name: 'Cofre', quantity: 16, type: 'almacenamiento' },
  { name: 'Cama', quantity: 1, type: 'mueble' },
  
  // Armas y Combate
  { name: 'Arco', quantity: 1, type: 'arma' },
  { name: 'Flecha', quantity: 64, type: 'munición' },
  
  // Items Especiales
  { name: 'Libro', quantity: 32, type: 'crafteo' },
  { name: 'Cubo de Agua', quantity: 1, type: 'líquido' },
  { name: 'TNT', quantity: 16, type: 'explosivo' }
];

// Paso 3: Limpiar la tabla antes de insertar nuevos datos
// Esto es importante para no tener datos duplicados
db.run('DELETE FROM items', [], (err) => {
  if (err) {
    console.error('Error al limpiar la tabla:', err);
    return;
  }
  console.log('🧹 Tabla limpiada con éxito');

  // Paso 4: Preparar la consulta SQL para insertar items
  // Usamos una consulta preparada para mayor seguridad
  const stmt = db.prepare('INSERT INTO items (name, quantity, type) VALUES (?, ?, ?)');
  
  // Paso 5: Insertar cada item en la base de datos
  minecraftItems.forEach(item => {
    stmt.run([item.name, item.quantity, item.type], (err) => {
      if (err) {
        console.error('Error al insertar item:', err);
      }
    });
  });
  
  // Paso 6: Finalizar la consulta preparada
  stmt.finalize();
  console.log('✨ Items de Minecraft insertados con éxito!');
  
  // Paso 7: Verificar que los items se insertaron correctamente
  db.all('SELECT * FROM items', [], (err, rows) => {
    if (err) {
      console.error('Error al verificar items:', err);
      return;
    }
    console.log('📦 Items en la base de datos:');
    console.table(rows);
    
    // Paso 8: Cerrar la conexión a la base de datos
    db.close((err) => {
      if (err) {
        console.error('Error al cerrar la base de datos:', err);
        return;
      }
      console.log('🎯 Base de datos cerrada');
    });
  });
}); 