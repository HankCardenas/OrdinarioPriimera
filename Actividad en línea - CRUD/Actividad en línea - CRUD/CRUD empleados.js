const express = require('express');
const bodyParser = require('body-parser');
const empleados = require('./empleados');
const puerto = 3000;

const app = express();
app.use(bodyParser.json())

app.listen(puerto, () => {
    console.log('servicio iniciado')
})


app.post('/empleados', async (req, res) => { // create
    const { nombre, telefono, nacimiento, sueldo } = req.body;
    const data = await empleados.create({
        nombre, telefono, nacimiento, sueldo   
    });
    res.send(data);
});

app.get('/empleados', async (req, res) => { // read
    const data = await empleados.findAll();
    res.send(data);
});

app.put('/empleados/:id', async (req, res) => { // update
    const { nombre, telefono, nacimiento, sueldo } = req.body;
    const { id } = req.params;
    const data = empleadoss.update({
        nombre, telefono, nacimiento, sueldo
    }, {
        where: {
            id
        }
    })
    res.send(data);
});

app.delete('/empleados/:id', async (req, res) => { // delete
    const { id } = req.params;
    const data = await empleados.destroy({
        where: {
            id
        }
    })
    res.send(data);
});