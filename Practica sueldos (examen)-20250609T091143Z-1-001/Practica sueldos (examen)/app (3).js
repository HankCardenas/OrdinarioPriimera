const express = require('express')
const app = express()
const puerto= 3000
const bodyParser = require('body-parser')
const sueldos = require('./models/sueldos')

app.use(bodyParser.json())

app.listen(puerto, () => {
    console.log('servicio iniciado')
})

app.post('/sueldos/calcular', async (req,res) => {
    const { tipo,dias } = req.body;
    const data = await sueldos.findOne({
        where: {
            tipo
        }
    })
    let { sueldoDiario, bonoMensual} = data;
    if (bonoMensual < 25){
        bonoMensual=0;
    }
    const total = sueldoDiario * dias + bonoMensual;
    res.send({
        tipo, dias, sueldoDiario, bonoMensual, total
    })

    

})