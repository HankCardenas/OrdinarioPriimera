const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const clientes = require('./clientes');
const puerto = 3000;

const secretKey = 'secret';

const app = express();
app.use(bodyParser.json())

app.listen(puerto, () => {
    console.log('servicio iniciado')
})

app.post('/login', (req, res) => {
    const { usuario, password } = req.body;
    if (usuario == 'admin' && password == '123') {
        const token = jwt.sign({ usuario }, secretKey, { expiresIn: '1h' }); // utilizar JWT
        res.send(token)
    } else {
        res.status(404);
    }
})

function verificarToken(req, res, next) { // middleware 
    const header = req.header('Authorization') || '';
    const token = header.split(' ')[1];
    if (!token) {
        res.status(401).json({mensaje: 'Token no proporcionado'});
    } else {
        try {
            const payload = jwt.verify(token, secretKey);
            next();
        } catch {
            res.status(401).json({mensaje: 'Token incorrecto'});
        }
    }
}

app.post('/clientes',verificarToken, async (req, res) => { // create
    const { nombre, correo, telefono, direccion } = req.body;
    const data = await clientes.create({
        nombre, correo, telefono, direccion   
    });
    res.send(data);
});

app.get('/clientes',verificarToken, async (req, res) => { // read
    const data = await clientes.findAll();
    res.send(data);
});

app.put('/clientes/:id',verificarToken, async (req, res) => { // update
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

app.delete('/clientes/:id',verificarToken, async (req, res) => { // delete
    const { id } = req.params;
    const data = await clientes.destroy({
        where: {
            id
        }
    })
    res.send(data);
});