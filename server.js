import express from 'express';
import PreguntaController from './controller/preguntas-controller.js';
import RespuestaController from './controller/respuestas-controller.js';

const app = express();

app.use(express.json());

app.use("/api/pregunta", PreguntaController);
app.use("/api/respuesta", RespuestaController);
console.log("HOLA!");

const port = 3030;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
