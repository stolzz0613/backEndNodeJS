const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

const app = express();

conectarDB();

//Habilitar express.json
app.use(express.json({extended: true}));

//Habilitar cors
app.use(cors());

// PUERTO DE LA APP
const port = process.env.PORT || 4000;

//importar rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));

//ARRANCAR APP
app.listen(port, '0.0.0.0', ()=> {
    console.log(`El servidor esta funcionando en el puerto ${port}`);
});