const express = require('express');
const bodyParser = require('body-parser');
const proveedores = require('./proveedores');
const puerto = 3000;

const app = express();
app.use(bodyParser.json())

app.listen(puerto, () => {
    console.log('servicio iniciado')
})


app.post('/proveedores', async (req, res) => { // create
    const { nombre, direccion } = req.body;
    const data = await proveedores.create({
        nombre, direccion   
    });
    res.send(data);
});

app.get('/proveedores', async (req, res) => { // read
    const data = await proveedores.findAll();
    res.send(data);
});

app.put('/proveedores/:id', async (req, res) => { // update
    const { nombre, direccion } = req.body;
    const { id } = req.params;
    const data = proveedores.update({
        nombre, direccion
    }, {
        where: {
            id
        }
    })
    res.send(data);
});

app.delete('/proveedores/:id', async (req, res) => { // delete
    const { id } = req.params;
    const data = await proveedores.destroy({
        where: {
            id
        }
    })
    res.send(data);
});