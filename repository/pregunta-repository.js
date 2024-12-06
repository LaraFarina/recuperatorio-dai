import pkg from 'pg';
const { Client } = pkg;
import { DBConfig } from './dbconfig.js';

export class PreguntaRepository {
  constructor() {
    this.DBClient = new Client(DBConfig);
    this.DBClient.connect().catch((err) => console.error('Error al conectar con la base de datos:', err));
  }

  async crearPregunta(pregunta) {
    try {
      const query = `
        INSERT INTO Pregunta (Pregunta, Opcion1, Opcion2, Opcion3, Opcion4, RespuestaCorrecta, FechaCreacion)
        VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
        RETURNING *;
      `;
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
    } catch (error) {
      console.error('Error al crear pregunta:', error);
      throw error;
    }
  }

  async actualizarPregunta(id, Pregunta) {
    try {
        const sql = `
            UPDATE preguntas
            SET
                Pregunta = COALESCE($1, pregunta),
                Opcion1 = COALESCE($2, opcion1),
                Opcion2 = COALESCE($3, opcion2),
                Opcion3 = COALESCE($4, opcion3),
                Opcion4 = COALESCE($5, opcion4),
                RespuestaCorrecta = COALESCE($6, RespuestaCorrecta)
            WHERE id = $7
            RETURNING *;
        `;
       
        const values = [Pregunta.pregunta,Pregunta.opcion1,Pregunta.opcion2,Pregunta.opcion3,Pregunta.opcion4,Pregunta.respuestaCorrecta,id];
            const result = await this.DBClient.query(sql, values);
        if (result.rows.length > 0) {
            return result.rows[0];
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error al actualizar la pregunta:", error);
        throw new Error("Error al actualizar la pregunta en la base de datos.");
    }
}


  async eliminarPregunta(preguntaId) {
    try {
      // Eliminar respuestas asociadas
      const deleteRespuestasQuery = 'DELETE FROM Respuesta WHERE PreguntaId = $1;';
      await this.DBClient.query(deleteRespuestasQuery, [preguntaId]);
  
      // Eliminar la pregunta
      const deletePreguntaQuery = 'DELETE FROM Pregunta WHERE PreguntaId = $1 RETURNING *;';
      const { rows } = await this.DBClient.query(deletePreguntaQuery, [preguntaId]);
  
      return rows[0];
    } catch (error) {
      console.error('Error al eliminar pregunta:', error);
      throw error;
    }
  }
  
  

  async obtenerPreguntaAzar() {
    try {
      const query = 'SELECT * FROM Pregunta ORDER BY RANDOM() LIMIT 1;';
      const { rows } = await this.DBClient.query(query);
      return rows[0];
    } catch (error) {
      console.error('Error al obtener pregunta al azar:', error);
      throw error;
    }
  }

  async obtenerTodasLasPreguntas(palabraClave, orden) {
    try {
      let query = 'SELECT * FROM Pregunta';
      const values = [];

      if (palabraClave) {
        query += ' WHERE LOWER(Pregunta) LIKE LOWER($1)';
        values.push(`%${palabraClave}%`);
      }

      if (orden === 'fecha') {
        query += ' ORDER BY FechaCreacion DESC';
      }

      const { rows } = await this.DBClient.query(query, values);
      return rows;
    } catch (error) {
      console.error('Error al obtener preguntas:', error);
      throw error;
    }
  }

  async crearRespuesta(respuesta) {
    const query = `
        INSERT INTO Respuesta (PreguntaId, UserId, RespuestaSeleccionada, EsRespuestaCorrecta, FechaCreacion)
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
        RETURNING *`;

    const values = [
        respuesta.preguntaId,
        respuesta.userId,
        respuesta.respuestaSeleccionada,
        respuesta.esRespuestaCorrecta
    ];

    const { rows } = await this.DBClient.query(query, values);
    return rows[0];
}
}
