import express from 'express';
import { PreguntaService } from '../service/pregunta-service.js';

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
    return {
        id,
        Pregunta: body.preguntaTexto,  // Cambiado de preguntaTexto a Pregunta
        Opcion1: body.opcion1,
        Opcion2: body.opcion2,
        Opcion3: body.opcion3,
        Opcion4: body.opcion4,
        RespuestaCorrecta: body.respuestaCorrecta
    };
};


router.post('/', async (req, res) => {
    const { preguntaTexto, opcion1, opcion2, opcion3, opcion4, respuestaCorrecta } = req.body;
    if (!preguntaTexto || !opcion1 || !opcion2 || !opcion3 || !opcion4 || respuestaCorrecta === undefined) {
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

/* router.put('/:id', async (req, res) => {
    console.log('Datos recibidos:', req.body);
    console.log('ID recibido:', req.params.id);

    const preguntaId = parseInt(req.params.id, 10);
    if (isNaN(preguntaId)) {
        return handleError(res, 'ID de pregunta no válido.');
    }

    const { preguntaTexto, opcion1, opcion2, opcion3, opcion4, respuestaCorrecta } = req.body;
    if (!preguntaTexto || !opcion1 || !opcion2 || !opcion3 || !opcion4 || respuestaCorrecta === undefined) {
        return handleError(res, 'Todos los campos son necesarios.');
    }

    const preguntaModificada = createPreguntaFromBody(preguntaId, req.body);
    console.log('Pregunta modificada:', preguntaModificada);

    handlePreguntaResponse(
        res,
        preguntaServiceInstance.actualizarPregunta(preguntaModificada),
        false,
        `Pregunta con ID ${preguntaId} no encontrada.`
    );
});
*/

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

  router.post("/", async (request, response) => {
    const { pregunta, opcion1, opcion2, opcion3, opcion4, respuestaCorrecta } = request.body;


    if (typeof pregunta !== 'string' ||typeof opcion1 !== 'string' ||typeof opcion2 !== 'string' ||typeof opcion3 !== 'string' ||typeof opcion4 !== 'string' ||typeof respuestaCorrecta !== 'string'
    ) {
        return response.status(400).json({ error: "Todos los campos deben ser cadenas de texto." });
    }


    const Pregunta = { pregunta, opcion1, opcion2, opcion3, opcion4, respuestaCorrecta };
    if (![opcion1, opcion2, opcion3, opcion4].includes(respuestaCorrecta)) {
        return response.status(400).json({ error: "La respuesta correcta debe ser una de las opciones proporcionadas." });
    }


    try {
        if (!pregunta || !opcion1 || !opcion2 || !opcion3 || !opcion4 || !respuestaCorrecta) {
            return response.status(400).json({ error: "Todos los campos son obligatorios." });
        }
        const fechaCreacion = new Date().toISOString(); // Fecha y hora actual
        const result = await PreguntaService.createPregunta(Pregunta, fechaCreacion);
        return response.status(201).json({ message: 'Inscripción exitosa.', result });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: 'Ocurrió un error en el servidor.' });
    }
}); 

router.put("/:id", async (request, response) => {
    const { id } = request.params;
    const { pregunta, opcion1, opcion2, opcion3, opcion4, respuestaCorrecta } = request.body;

    if (pregunta && typeof pregunta !== "string") {
        return response.status(400).json({ error: "preg tiene que ser texto" });
    }
    if (opcion1 && typeof opcion1 !== "string") {
        return response.status(400).json({ error: "op1 tiene que ser textp" });
    }
    if (opcion2 && typeof opcion2 !== "string") {
        return response.status(400).json({ error: "op2 tiene que ser texto" });
    }
    if (opcion3 && typeof opcion3 !== "string") {
        return response.status(400).json({ error: "op3 tiene que ser textp" });
    }
    if (opcion4 && typeof opcion4 !== "string") {
        return response.status(400).json({ error: "op4 tiene que ser texto" });
    }
    if (respuestaCorrecta && typeof respuestaCorrecta !== "string") {
        return response.status(400).json({ error: "resp correcta tiene que ser texto" });
    }

    try {
        const existePregunta = await PreguntaService.getPreguntaById(id);
        if (!existePregunta) {
            return response.status(404).json({ error: "Pregunta no encontrada" });
        }

        if (respuestaCorrecta) {
            const opcionesActuales = [
                opcion1 || existePregunta.opcion1,
                opcion2 || existePregunta.opcion2,
                opcion3 || existePregunta.opcion3,
                opcion4 || existePregunta.opcion4,
            ];

            if (!opcionesActuales.includes(respuestaCorrecta)) {
                return response.status(400).json({
                    error: "la resp correcta tiene que ya existir en las opciones",
                });
            }
        }

        const camposActualizados = { pregunta,opcion1, opcion2,opcion3,opcion4,respuestaCorrecta,
        };

        const preguntaActualizada = await PreguntaService.updatePregunta(id, camposActualizados);

        if (preguntaActualizada) {
            return response.status(200).json({
                message: "Pregunta actualizada correctamente.",
                result: preguntaActualizada,
            });
        } else {
            return response.status(404).json({ error: "No se pudo actualizar la pregunta porque no fue encontrada." });
        }
    } catch (error) {
        console.error("Error al actualizar la pregunta:", error);
        return response.status(500).json({ error: "Ocurrió un error en el servidor al intentar actualizar la pregunta." });
    }
    
});


});

export default router;
