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
    try {
        const { pregunta, opcion1, opcion2, opcion3, opcion4, respuestaCorrecta } = req.body;

        console.log(pregunta, opcion1, opcion2, opcion3, opcion4, respuestaCorrecta );
        // Validación de campos requeridos
        if (!pregunta || !opcion1 || !opcion2 || !opcion3 || !opcion4 || respuestaCorrecta === undefined) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const preguntaCreada = await preguntaServiceInstance.crearPregunta(pregunta, opcion1, opcion2, opcion3, opcion4, respuestaCorrecta);
        if (preguntaCreada) {
            res.status(201).json("Pregunta creada");
        } else {
            res.status(400).json("Pregunta no creada");
        }
    } catch (error) {
        console.error('Error al crear pregunta:', error.message);
        res.status(500).send('Error al crear pregunta');
    }
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