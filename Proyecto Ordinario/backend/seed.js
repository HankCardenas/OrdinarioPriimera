// ===============================================
// Nombre: Seed.js - Población de Base de Datos Red Dead Redemption 2
// Autor: [Tu Nombre]
// Fecha: 30/05/2025
// Descripción: Este archivo crea y puebla la base de datos
//              con armas del juego Red Dead Redemption 2
// ===============================================

const sqlite3 = require('sqlite3').verbose();

// Paso 1: Conectar a la base de datos SQLite
const db = new sqlite3.Database('./rdr2.db', (err) => {
  if (err) {
    console.error('😢 Error conectando a la base de datos:', err);
    process.exit(1);
  }
  console.log('🎮 Conectado a la base de datos de Red Dead Redemption 2!');
});

// Paso 2: Definir las armas de RDR2 que queremos guardar
const rdr2Weapons = [
  // Revólveres
  { name: 'Revólver Schofield', quantity: 1, type: 'revólver' },
  { name: 'Revólver Cattleman', quantity: 1, type: 'revólver' },
  { name: 'Revólver Double-Action', quantity: 1, type: 'revólver' },
  
  // Pistolas
  { name: 'Pistola Volcanic', quantity: 1, type: 'pistola' },
  { name: 'Pistola Mauser', quantity: 1, type: 'pistola' },
  { name: 'Pistola Semi-Automática', quantity: 1, type: 'pistola' },
  
  // Rifles
  { name: 'Rifle Lancaster', quantity: 1, type: 'rifle' },
  { name: 'Rifle Litchfield', quantity: 1, type: 'rifle' },
  { name: 'Rifle Springfield', quantity: 1, type: 'rifle' },
  
  // Escopetas
  { name: 'Escopeta de Dos Cañones', quantity: 1, type: 'escopeta' },
  { name: 'Escopeta de Báscula', quantity: 1, type: 'escopeta' },
  { name: 'Escopeta de Repetición', quantity: 1, type: 'escopeta' },
  
  // Armas de Cuerpo a Cuerpo
  { name: 'Machete', quantity: 1, type: 'melee' },
  { name: 'Hacha de Guerra', quantity: 1, type: 'melee' },
  { name: 'Cuchillo de Caza', quantity: 1, type: 'melee' },
  
  // Armas Especiales
  { name: 'Ballesta', quantity: 1, type: 'especial' },
  { name: 'Lanzador de Dinamita', quantity: 1, type: 'especial' },
  { name: 'Rifle de Caza', quantity: 1, type: 'rifle' }
];

// Función principal para inicializar la base de datos
async function initializeDatabase() {
  try {
    // Crear la tabla si no existe
    await new Promise((resolve, reject) => {
      db.run(`
        CREATE TABLE IF NOT EXISTS weapons (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          quantity INTEGER NOT NULL,
          type TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    console.log('📋 Tabla weapons creada o verificada');

    // Limpiar la tabla
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM weapons', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    console.log('🧹 Tabla limpiada con éxito');

    // Iniciar transacción
    await new Promise((resolve, reject) => {
      db.run('BEGIN TRANSACTION', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Insertar armas
    const stmt = db.prepare('INSERT INTO weapons (name, quantity, type) VALUES (?, ?, ?)');
    
    for (const weapon of rdr2Weapons) {
      await new Promise((resolve, reject) => {
        stmt.run([weapon.name, weapon.quantity, weapon.type], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }
    
    stmt.finalize();

    // Confirmar transacción
    await new Promise((resolve, reject) => {
      db.run('COMMIT', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    console.log('✨ Armas de RDR2 insertadas con éxito!');

    // Verificar las armas insertadas
    const rows = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM weapons', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    console.log('📦 Armas en la base de datos:');
    console.table(rows);

  } catch (error) {
    console.error('❌ Error durante la inicialización:', error);
    // Revertir transacción en caso de error
    await new Promise((resolve) => {
      db.run('ROLLBACK', () => resolve());
    });
  } finally {
    // Cerrar la conexión
    db.close((err) => {
      if (err) {
        console.error('Error al cerrar la base de datos:', err);
        process.exit(1);
      }
      console.log('🎯 Base de datos cerrada');
    });
  }
}

// Ejecutar la inicialización
initializeDatabase(); 