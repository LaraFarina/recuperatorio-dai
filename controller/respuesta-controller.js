import express from 'express';
import { RespuestaService } from '../service/respuesta-service.js'; 
import { Respuesta } from '../entities/respuesta-entities.js';
const router = express.Router();
const respuestaServiceInstance = new RespuestaService();

router.post('/', async (req, res) => {
    const { preguntaId, userId, respuestaSeleccionada, esRespuestaCorrecta } = req.body;

    const respuesta = new Respuesta(
        null,
        preguntaId,
        userId,
        respuestaSeleccionada,
        esRespuestaCorrecta
    );

    if (!preguntaId || !userId || !respuestaSeleccionada || esRespuestaCorrecta === undefined) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    try {
        const respuestaCreada = await respuestaServiceInstance.crearRespuesta(respuesta);
        res.status(201).json(respuestaCreada);
    } catch (error) {
        console.error('Error al guardar la respuesta:', error);
        res.status(400).json({ error: 'Hubo un problema al guardar la respuesta.', detalle: error.message });
    }
});

export default router;