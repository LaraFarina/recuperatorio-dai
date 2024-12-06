import { PreguntaRepository } from '../repository/pregunta-repository.js'; // Verifica la ruta del archivo

export class PreguntaService {
    constructor() {
        // Inicialización correcta del repositorio
        this.bd = new PreguntaRepository(); 
    }

    async crearPregunta(pregunta, opcion1, opcion2, opcion3, opcion4, respuestacorrecta) {
        try {
            return await this.bd.crearPregunta(pregunta, opcion1, opcion2, opcion3, opcion4, respuestacorrecta);
        } catch (error) {
            throw new Error('Error al crear pregunta en la base de datos: ' + error.message);
        }
    }

    async actualizarPregunta(pregunta) {
        try {
            return await this.bd.actualizarPregunta(pregunta);
        } catch (error) {
            throw new Error('Error al actualizar pregunta: ' + error.message);
        }
    }

    async eliminarPregunta(preguntaId) {
        try {
            return await this.bd.eliminarPregunta(preguntaId);
        } catch (error) {
            throw new Error('Error al eliminar pregunta: ' + error.message);
        }
    }

    async obtenerPreguntaAzar() {
        try {
            return await this.bd.obtenerPreguntaAzar();
        } catch (error) {
            throw new Error('Error al obtener pregunta al azar: ' + error.message);
        }
    }

    async obtenerTodasLasPreguntas(palabraClave, orden) {
        try {
            return await this.bd.obtenerTodasLasPreguntas(palabraClave, orden);
        } catch (error) {
            throw new Error('Error al obtener preguntas: ' + error.message);
        }
    }
}
