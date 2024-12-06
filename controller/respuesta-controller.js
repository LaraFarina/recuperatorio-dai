import express from "express";
import respuestaService from "../service/respuesta-service.js";
import preguntaService from "../service/pregunta-service.js";

const RespuestaService = new respuestaService();
const PreguntaService = new preguntaService();

const router = express.Router();

router.post("/", async (request, response) => {
    const { preguntaId, respuestaSeleccionada, userId } = request.body;

    console.log(preguntaId, respuestaSeleccionada, userId);
    if (!preguntaId || !respuestaSeleccionada || userId === undefined) {
        return response.status(400).json({ 
            error: "Faltan campos obligatorios: preguntaId, respuestaSeleccionada, userId." 
        });
    }

    if (typeof userId !== "number" || userId < 0) {
        return response.status(400).json({ 
            error: "El campo userId debe ser un número mayor a 0." 
        });
    }

    try {
        const ExistePregunta = await PreguntaService.getPreguntaById(preguntaId);
        console.log(ExistePregunta);
        if (!ExistePregunta) {
            return response.status(404).json({ error: "Pregunta no encontrada." });
        }

        if (![ExistePregunta.opcion1, ExistePregunta.opcion2, ExistePregunta.opcion3, ExistePregunta.opcion4].includes(respuestaSeleccionada)) {
            return response.status(400).json({ 
                error: "La respuesta seleccionada debe ser una de las opciones proporcionadas." 
            });
        }


        const esCorrecta = ExistePregunta.respuesta_correcta === respuestaSeleccionada;
        console.log(esCorrecta + " hokla");


        const fechaCreacion = new Date().toISOString();
        const respuesta = await RespuestaService.createRespuesta(userId, preguntaId, respuestaSeleccionada, esCorrecta, fechaCreacion);

        return response.status(201).json({ 
            message: "Respuesta registrada correctamente.", 
            result: respuesta 
        });
    } catch (error) {
        console.error("Error al registrar la respuesta:", error);
        return response.status(500).json({ error: "Ocurrió un error al registrar la respuesta." });
    }
});

//funciona

router.get("/", async (request, response) => {
    const { preguntaId, userId } = request.query; 

    try {
        const respuestas = await RespuestaService.getRespuestas(preguntaId, userId);

        if (respuestas.length === 0) {
            return response.status(404).json({ 
                error: "No hay resps para los params" 
            });
        }

        return response.status(200).json(respuestas);
    } catch (error) {
        console.error("Error respuestas ", error);
        return response.status(500).json({ error: "Ocurrió un error al obtener las respuestas" });
    }
});

export default router;

