import pkg from 'pg';
const { Client } = pkg;
import { DBConfig } from './dbconfig.js';

export class PreguntaRepository {
    constructor() {
        this.DBClient = new Client(DBConfig);
        this.DBClient.connect();
    }

    async crearPregunta(pregunta) {
        const query = ` 
            INSERT INTO Pregunta (Pregunta, Opcion1, Opcion2, Opcion3, Opcion4, RespuestaCorrecta, FechaCreacion)
            VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
            RETURNING *`;
        const values = [
            pregunta.preguntaTexto, 
            pregunta.opcion1, 
            pregunta.opcion2, 
            pregunta.opcion3, 
            pregunta.opcion4, 
            pregunta.respuestaCorrecta
        ];
        const { rows } = await this.DBClient.query(query, values);
        return rows[0];
    }

    async actualizarPregunta(pregunta) {
        const query = `
            UPDATE Pregunta
            SET Pregunta = $1, Opcion1 = $2, Opcion2 = $3, Opcion3 = $4, Opcion4 = $5, RespuestaCorrecta = $6
            WHERE PreguntaId = $7
            RETURNING *`;
        const values = [
            pregunta.preguntaTexto, 
            pregunta.opcion1, 
            pregunta.opcion2, 
            pregunta.opcion3, 
            pregunta.opcion4, 
            pregunta.respuestaCorrecta, 
            pregunta.id
        ];
        const { rows } = await this.DBClient.query(query, values);
        return rows[0];
    }

    async eliminarPregunta(preguntaId) {
        const query = 'DELETE FROM Pregunta WHERE PreguntaId = $1 RETURNING *';
        const values = [preguntaId];
        const { rows } = await this.DBClient.query(query, values);
        return rows[0];
    }

    async obtenerPreguntaAzar() {
        const query = 'SELECT * FROM Pregunta ORDER BY RANDOM() LIMIT 1';
        const { rows } = await this.DBClient.query(query);
        return rows[0];
    }

    async obtenerTodasLasPreguntas(palabraClave, orden) {
        let query = 'SELECT * FROM Pregunta';
        const values = [];

        if (palabraClave) {
            query += ` WHERE LOWER(Pregunta) LIKE '%' || LOWER($1) || '%'`;
            values.push(palabraClave);
        }

        if (orden === 'fecha') {
            query += ' ORDER BY FechaCreacion DESC';
        }

        const { rows } = await this.DBClient.query(query, values);
        return rows;
    }
}
