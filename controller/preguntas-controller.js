import express from 'express';
import { PreguntaService } from '../service/preguntas-service.js';
import { Preguntas } from '../entities/preguntas-entities.js';

const preguntaService = new PreguntaService();
const router = express.Router();

const validarPregunta = (req, res, next) => {
    const { preguntaTexto, opcion1, opcion2, opcion3, opcion4, respuestaCorrecta } = req.body;

    if (!preguntaTexto || !opcion1 || !opcion2 || !opcion3 || !opcion4 || !respuestaCorrecta) {
        return res.status(400).json({ message: 'Por favor, complete todos los campos.' });
    }

    next();
};

const crearPregunta = async (req, res) => {
    const { preguntaTexto, opcion1, opcion2, opcion3, opcion4, respuestaCorrecta } = req.body;

    const pregunta = new Preguntas(
        null,
        preguntaTexto,
        opcion1,
        opcion2,
        opcion3,
        opcion4,
        respuestaCorrecta
    );

    try {
        const nuevaPregunta = await preguntaService.crearPregunta(pregunta);
        res.status(201).json(nuevaPregunta);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Ocurrió un error al intentar guardar la pregunta.' });
    }
};

const actualizarPregunta = async (req, res) => {
    const preguntaId = parseInt(req.params.id, 10);
    if (isNaN(preguntaId)) {
        return res.status(400).json({ message: 'El ID proporcionado no es válido.' });
    }

    const { preguntaTexto, opcion1, opcion2, opcion3, opcion4, respuestaCorrecta } = req.body;
    const pregunta = new Preguntas(
        preguntaId,
        preguntaTexto,
        opcion1,
        opcion2,
        opcion3,
        opcion4,
        respuestaCorrecta
    );

    try {
        const preguntaActualizada = await preguntaService.actualizarPregunta(pregunta);
        if (preguntaActualizada) {
            res.json(preguntaActualizada);
        } else {
            res.status(404).json({ message: `Pregunta con ID ${preguntaId} no encontrada.` });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No se pudo actualizar la pregunta, intente nuevamente.' });
    }
};

const eliminarPregunta = async (req, res) => {
    const preguntaId = parseInt(req.params.id);

    try {
        const preguntaEliminada = await preguntaService.eliminarPregunta(preguntaId);
        if (preguntaEliminada) {
            res.json({ message: `La pregunta con ID ${preguntaId} ha sido eliminada exitosamente.` });
        } else {
            res.status(404).json({ message: `No se encontró una pregunta con el ID ${preguntaId}.` });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Hubo un problema al eliminar la pregunta, por favor intente más tarde.' });
    }
};

const obtenerPreguntaAzar = async (req, res) => {
    try {
        const preguntaAzar = await preguntaService.obtenerPreguntaAzar();
        res.json(preguntaAzar);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No se pudo obtener una pregunta aleatoria en este momento.' });
    }
};

const obtenerTodasLasPreguntas = async (req, res) => {
    const palabraClave = req.query.palabraClave;
    const orden = req.query.orden;

    try {
        const preguntas = await preguntaService.obtenerTodasLasPreguntas(palabraClave, orden);
        res.json(preguntas);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Ocurrió un error al intentar obtener las preguntas.' });
    }
};

router.post('/', validarPregunta, crearPregunta);
router.put('/:id', validarPregunta, actualizarPregunta);
router.delete('/:id', eliminarPregunta);
router.get('/azar', obtenerPreguntaAzar);
router.get('/', obtenerTodasLasPreguntas);

export default router;
