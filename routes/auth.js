//Rutas para autenticar Usuarios
const express = require('express');
const router = express.Router();
const {check} = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

//Iniciar sesión
// api/auth

router.post('/',
    authController.autenticarUsuario
);
module.exports = router;

//Obtiene el usuario autenticado
router.get('/',
    auth,
    authController.usuarioAutenticado
);