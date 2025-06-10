const express = require ('express')
const boletos = require('./models/boletos')
const bodyParser = require('body-parser')
const app= express()
const puerto = 3000

app.use(bodyParser.json())
//iniciar servidor
app.listen(puerto, () => {
    console.log('servidor iniciado')
})
//ruta
app.post('/boletos', async(req, res) =>{
    const {localidad, fecha, estudiante} = req.body;
    const data = await boletos.findOne({
        where : {
            localidad,
            fecha
        }
    })
    let {precio,descuento}=data;
    if(!estudiante){
        descuento=0;
    }
    const total=precio-(precio*descuento);
    res.send({
        localidad,
        fecha,
        precio,
        descuento,
        total
    });

});