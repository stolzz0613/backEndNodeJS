const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');


exports.crearUsuario = async(req, res) => {

    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()})
    }

    const {email, password} = req.body;

    try {
        //Validar que sea unico
        let usuario = await Usuario.findOne({email});

        if(usuario) {
            return res.status(400).json({msg: 'El usuario ya existe'});
        }

        //crear el nuevo usuario
        usuario = new Usuario(req.body);

        //Hash password
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(password, salt);

        //guardar usuario
        await usuario.save();

        //crear jwt
        const payload = {
            usuario: {
                id:usuario.id
            }
        }

        //firmar el JWT
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600
        }, (error, token) => {
            if(error) throw error;

            //Mensaje de confirmacion
            res.json({token});
        });

    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error');
    }
}