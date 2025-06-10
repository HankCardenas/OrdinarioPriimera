const express = require('express');
const bodyParser = require('body-parser');
const articulos = require('./articulos');
const puerto = 3000;

const app = express();
app.use(bodyParser.json())

app.listen(puerto, () => {
    console.log('servicio iniciado')
})


app.post('/articulos', async (req, res) => { // create
    const { descripcion, precio, existencia } = req.body;
    const data = await articulos.create({
        descripcion, precio, existencia   
    });
    res.send(data);
});

app.get('/articulos', async (req, res) => { // read
    const data = await articulos.findAll();
    res.send(data);
});

app.put('/articulos/:id', async (req, res) => { // update
    const { descripcion, precio, existencia } = req.body;
    const { id } = req.params;
    const data = articulos.update({
        descripcion, precio, existencia
    }, {
        where: {
            id
        }
    })
    res.send(data);
});

app.delete('/articulos/:id', async (req, res) => { // delete
    const { id } = req.params;
    const data = await articulos.destroy({
        where: {
            id
        }
    })
    res.send(data);
});