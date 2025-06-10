const express = require('express');
const bodyParser = require('body-parser');
const clientes = require('./clientes');
const puerto = 3000;

const app = express();
app.use(bodyParser.json())

app.listen(puerto, () => {
    console.log('servicio iniciado')
})


app.post('/clientes', async (req, res) => { // create
    const { nombre, correo, telefono, direccion } = req.body;
    const data = await clientes.create({
        nombre, correo, telefono, direccion   
    });
    res.send(data);
});

app.get('/clientes', async (req, res) => { // read
    const data = await clientes.findAll();
    res.send(data);
});

app.put('/clientes/:id', async (req, res) => { // update
    const { nombre, correo, telefono, direccion } = req.body;
    const { id } = req.params;
    const data = clientes.update({
        nombre, correo, telefono, direccion
    }, {
        where: {
            id
        }
    })
    res.send(data);
});

app.delete('/clientes/:id', async (req, res) => { // delete
    const { id } = req.params;
    const data = await clientes.destroy({
        where: {
            id
        }
    })
    res.send(data);
});