import express from 'express';
import { RespuestaService } from '../service/respuestas-service.js';
import { Respuesta } from '../entities/respuestas-entities.js';

const router = express.Router();
const respuestaService = new RespuestaService();

const validarCampos = (req, res, next) => {
    const { preguntaId, userId, respuestaSeleccionada, esRespuestaCorrecta } = req.body;

    if (!preguntaId || !userId || !respuestaSeleccionada || esRespuestaCorrecta === undefined) {
        return res.status(400).json({ message: 'Todos los campos son requeridos.' });
    }

    next();
};

router.post('/', validarCampos, async (req, res) => {
    try {
        const { preguntaId, userId, respuestaSeleccionada, esRespuestaCorrecta } = req.body;

        const nuevaRespuesta = new Respuesta(
            null,
            preguntaId,
            userId,
            respuestaSeleccionada,
            esRespuestaCorrecta
        );

        const respuestaCreada = await respuestaService.crearRespuesta(nuevaRespuesta);
        
        res.status(201).json(respuestaCreada);
    } catch (error) {
        console.error('Error al crear la respuesta:', error);
        res.status(500).json({ message: 'Hubo un error al crear la respuesta.', error: error.message });
    }
});

export default router;
