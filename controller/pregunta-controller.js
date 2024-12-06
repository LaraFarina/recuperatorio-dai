import express from 'express';
import { PreguntaService } from '../service/pregunta-service.js';

const app = express();

app.use(express.json());

const router = express.Router();
const preguntaServiceInstance = new PreguntaService();

const handleError = (res, message, status = 400) => {
  console.error(message);
  return res.status(status).json({ error: message });
};

const handlePreguntaResponse = async (res, promise, successMessage, notFoundMessage) => {
  try {
    const result = await promise;
    if (result) {
      res.status(successMessage ? 201 : 200).json(result);
    } else {
      handleError(res, notFoundMessage, 404);
    }
  } catch (error) {
    handleError(res, error.message);
  }
};

const createPreguntaFromBody = (id, body) => {
    return new Pregunta(
      id,
      body.Pregunta,
      body.Opcion1,
      body.Opcion2,
      body.Opcion3,
      body.Opcion4,
      body.RespuestaCorrecta
    );
  };
  

  router.post('/', async (req, res) => {
    console.log('Cuerpo de la solicitud:', req.body); // Para ver el contenido del body
  
    const { preguntaTexto, opcion1, opcion2, opcion3, opcion4, respuestaCorrecta } = req.body;
  
    if (!preguntaTexto || !opcion1 || !opcion2 || !opcion3 || !opcion4 || respuestaCorrecta === undefined) {
      console.log('Campos faltantes:', opcion1, opcion2, opcion3, opcion4, respuestaCorrecta, preguntaTexto);
      return handleError(res, 'Todos los campos son necesarios.');
    }
  
    const nuevaPregunta = createPreguntaFromBody(null, req.body);
    handlePreguntaResponse(
      res,
      preguntaServiceInstance.crearPregunta(nuevaPregunta),
      true,
      'No se pudo crear la pregunta.'
    );
});

  

router.put('/:id', async (req, res) => {
  const preguntaId = parseInt(req.params.id, 10);

  if (isNaN(preguntaId)) {
    return handleError(res, 'ID de pregunta no válido.');
  }

  const { preguntaTexto, opcion1, opcion2, opcion3, opcion4, respuestaCorrecta } = req.body;

  if (!preguntaTexto || !opcion1 || !opcion2 || !opcion3 || !opcion4 || respuestaCorrecta === undefined) {
    console.log(opcion1, opcion2, opcion3, opcion4, respuestaCorrecta, preguntaTexto);
    return handleError(res, 'Todos los campos son necesarios.');
  }

  const preguntaModificada = createPreguntaFromBody(preguntaId, req.body);
  handlePreguntaResponse(
    res,
    preguntaServiceInstance.actualizarPregunta(preguntaModificada),
    false,
    `Pregunta con ID ${preguntaId} no encontrada.`
  );
});

router.delete('/:id', async (req, res) => {
  const preguntaId = parseInt(req.params.id, 10);

  if (isNaN(preguntaId)) {
    return handleError(res, 'ID de pregunta no válido.');
  }

  handlePreguntaResponse(
    res,
    preguntaServiceInstance.eliminarPregunta(preguntaId),
    false,
    `No se encontró la pregunta con ID ${preguntaId}.`
  );
});

router.get('/azar', async (req, res) => {
  handlePreguntaResponse(
    res,
    preguntaServiceInstance.obtenerPreguntaAzar(),
    false,
    'Hubo un problema al obtener la pregunta al azar.'
  );
});

router.get('/', async (req, res) => {
  const { palabraClave, orden } = req.query;
  handlePreguntaResponse(
    res,
    preguntaServiceInstance.obtenerTodasLasPreguntas(palabraClave, orden),
    false,
    'No se pudieron obtener las preguntas.'
  );
});

export default router;