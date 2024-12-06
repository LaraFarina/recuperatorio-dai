import { PreguntaRepository } from '../repository/pregunta-repository.js';

export class PreguntaService {
    constructor() {
        this.bd = new PreguntaRepository();
    }

    async crearPregunta(pregunta,fechaCreacion)
    {
      const crearPregunta = await PreguntaRepository.crearPregunta(Pregunta,fechaCreacion);
      return crearPregunta;
    }
   
    async actualizarPregunta(id, Pregunta)
    {
      const actualizarPregunta = await PreguntaRepository.actualizarPregunta(id, Pregunta);
      return actualizarPregunta;
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
