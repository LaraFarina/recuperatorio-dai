import pg from "pg";
import { DBConfig } from './db.js';


export default class Respuestas {
    
    constructor()
    {
        const {Client} = pg;
        this.DBClient = new Client(DBConfig);
        this.DBClient.connect();
    }
    async createRespuesta(userId, preguntaId, respuestaSeleccionada, esCorrecta, fechaCreacion) {
        try {
            const sql = `
                INSERT INTO respuestas (userId, preguntaId, RespuestaSeleccionada, EsRespuestaCorrecta, FechaCreaciob)
                VALUES ($1, $2, $3, $4, $5) RETURNING *;
            `;
            const values = [userId, preguntaId, respuestaSeleccionada, esCorrecta, fechaCreacion];

            const result = await this.DBClient.query(sql, values);
            return result.rows[0];
        } catch (error) {
            console.error("Error al crear la respuesta:", error);
            throw new Error("Error al registrar la respuesta en la base de datos.");
        }
    }
        
    async obtenerRespuestas(preguntaId, userId) {
            try {
                let sql = `SELECT * FROM respuestas`;
                const values = [];
    
                if (preguntaId) {
                    sql += ` WHERE preguntaId = $1`;
                    values.push(preguntaId);
                }
    
                if (userId) {
                    sql += values.length > 0 ? ` AND userId = $2` : ` WHERE userId = $1`;
                    values.push(userId);
                }
    
                const result = await this.DBClient.query(sql, values);
                return result.rows;
            } catch (error) {
                console.error("Error al obtener respuestas:", error);
                throw new Error("Error al obtener las respuestas desde la base de datos.");
            }
        }
    }
    
