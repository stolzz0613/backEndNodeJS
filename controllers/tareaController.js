const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const {validationResult} = require ('express-validator');

//Crear una nueva tarea
exports.crearTarea = async(req, res) => {
    //Revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()})
    }

    try {
        const {proyecto} = req.body;

        const existeProyecto = await Proyecto.findById(proyecto);
        
        if(!existeProyecto) {
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        //Verificar creador del proyecto
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No autorizado'});
        }

        //Crear tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({tarea});


    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};

//Obtiene las tareas por proyecto
exports.obtenerTareas = async (req, res) => {
    try {
        const {proyecto} = req.query;
        
        const existeProyecto = await Proyecto.findById(proyecto);
        
        if(!existeProyecto) {
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        //Verificar creador del proyecto
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No autorizado'});
        }

        //Obtener tareas por proyecto
        const tareas = await Tarea.find({proyecto}).sort({creado: -1});
        res.json({tareas});
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Actualizar una tarea

exports.actualizarTarea = async(req, res) => {
    try {
        const {proyecto, nombre, estado} = req.body;
        const existeProyecto = await Proyecto.findById(proyecto);

        // verificar si la tarea existe
        let tarea = await Tarea.findById(req.params.id);

        if (!tarea) {
            return res.status(404).send('No existe esa tarea');
        }

        //Verificar creador del proyecto
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No autorizado'});
        }

        //Crear un objeto con la nueva información
        const nuevaTarea = {};
        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;

        //Guardar tarea
        tarea = await Tarea.findOneAndUpdate({_id: req.params.id}, nuevaTarea, {new: true});
        res.json({tarea});

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Elimina una tarea
exports.eliminarTarea = async(req, res) => {
    try {
        const {proyecto} = req.query;
        const existeProyecto = await Proyecto.findById(proyecto);

        // verificar si la tarea existe
        let tarea = await Tarea.findById(req.params.id);

        if (!tarea) {
            return res.status(404).send('No existe esa tarea');
        }

        //Verificar creador del proyecto
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No autorizado'});
        }

        //Eliminar
        await Tarea.findOneAndRemove({_id: req.params.id});
        res.json({msg: 'Tarea Eliminada'});
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}