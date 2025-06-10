const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
app.use(express.json());
const ARCHIVO_ALUMNOS = 'alumnos.json';
function leerAlumnos() {
    try {
        const datos = fs.readFileSync(ARCHIVO_ALUMNOS, 'utf8');
        return JSON.parse(datos);
    } catch (error) {
        // Si el archivo no existe, retornar array vacío
        return [];
    }
}
//Función para guardar alumnos en el archivo
function guardarAlumnos(alumnos) {
    fs.writeFileSync(ARCHIVO_ALUMNOS, JSON.stringify(alumnos, null, 2));
}
//Endpoint POST para crear un alumno
app.post('/alumno', (req, res) => {
    const nuevoAlumno = req.body;
    //Validació de campos requeridos
    const camposRequeridos = ['cuenta', 'nombre', 'promedio', 'grado', 'grupo'];
    const camposFaltantes = camposRequeridos.filter(campo => !nuevoAlumno[campo]);
    if (camposFaltantes.length > 0) {
        return res.status(400).json({ 
            mensaje: `Faltan los siguientes campos: ${camposFaltantes.join(', ')}` 
        });
    }
    //Leer alumnos existentes
    const alumnos = leerAlumnos();
    // Verificar si la cuenta ya existe
    if (alumnos.some(alumno => alumno.cuenta === nuevoAlumno.cuenta)) {
        return res.status(400).json({
            mensaje: 'Ya existe un alumno con esa cuenta'
        });
    }

    // Agregar el alumno y guardar en archivo
    alumnos.push(nuevoAlumno);
    guardarAlumnos(alumnos);

    res.status(201).json({
        mensaje: 'Alumno creado exitosamente',
        alumno: nuevoAlumno
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});