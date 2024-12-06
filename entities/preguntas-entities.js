export class Pregunta { 
    constructor(id, preguntaTexto, opcion1, opcion2, opcion3, opcion4, respuestaCorrecta) {
        Object.assign(this, { id, preguntaTexto, opcion1, opcion2, opcion3, opcion4, respuestaCorrecta });
    }
}
