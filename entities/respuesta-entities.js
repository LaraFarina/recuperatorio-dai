export class Respuesta {
    constructor(id, preguntaId, userId, respuestaSeleccionada, esRespuestaCorrecta) {
        Object.assign(this, { id, preguntaId, userId, respuestaSeleccionada, esRespuestaCorrecta });
    }
}
