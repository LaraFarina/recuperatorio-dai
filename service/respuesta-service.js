import { RespuestaRepository } from '../repository/respuesta-repository.js';

export class RespuestaService {
    constructor() {
        this.bd = new RespuestaRepository();
    }

    async crearRespuesta(respuesta) {
        return await this.bd.crearRespuesta(respuesta);
    }
}
