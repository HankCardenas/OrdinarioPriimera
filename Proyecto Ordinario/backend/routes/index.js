const express = require('express');
const cors = require('cors');
const app = express();
const itemsroutes = require('./routes/items');


app.use(cors());
app.use(express.json());
app.use('/api/items', itemsroutes);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
