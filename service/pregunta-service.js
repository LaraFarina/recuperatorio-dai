import { PreguntaRepository } from '../repository/pregunta-repository.js';

export class PreguntaService {
    constructor() {
        this.bd = new PreguntaRepository();
    }

    async crearPregunta(pregunta) {
        return await this.bd.crearPregunta(pregunta);
    }

    async actualizarPregunta(pregunta) {
        return await this.bd.actualizarPregunta(pregunta);
    }

    async eliminarPregunta(preguntaId) {
        return await this.bd.eliminarPregunta(preguntaId);
    }

    async obtenerPreguntaAzar() {
        return await this.bd.obtenerPreguntaAzar();
    }

    async obtenerTodasLasPreguntas(palabraClave, orden) {
        return await this.bd.obtenerTodasLasPreguntas(palabraClave, orden);
    }

    async crearRespuesta(respuesta) {
    return await this.bd.crearRespuesta(respuesta);
}

}
