import pkg from 'pg';
const { Client } = pkg;
import { DBConfig } from './dbconfig.js';

export class RespuestaRepository {
    constructor() {
        this.DBClient = new Client(DBConfig);
        this.DBClient.connect();
    }

    async crearRespuesta(respuesta) {
        console.log('Datos recibidos en el repository:', respuesta);

        const query = `
            INSERT INTO Respuesta (PreguntaId, UserId, RespuestaSeleccionada, EsRespuestaCorrecta, FechaCreacion)
            VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
            RETURNING *`;
        
        const values = [ respuesta.preguntaId, respuesta.userId, respuesta.respuestaSeleccionada, respuesta.esRespuestaCorrecta ];

        console.log('Valores enviados al query:', values);

        const { rows } = await this.DBClient.query(query, values);
        return rows[0];
    }
}