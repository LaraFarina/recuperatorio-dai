import express from 'express';
import PreguntaController from './controller/pregunta-controller.js';
import RespuestaController from './controller/respuesta-controller.js';

const app = express();

app.use(express.json());

app.use("/api/preguntas", PreguntaController);
app.use("/api/respuestas", RespuestaController);
console.log("HOLA!");

const port = 3030;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
