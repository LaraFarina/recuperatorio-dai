CREATE TABLE Pregunta (
    PreguntaId SERIAL PRIMARY KEY,
    Pregunta TEXT NOT NULL,
    Opcion1 TEXT NOT NULL,
    Opcion2 TEXT NOT NULL,
    Opcion3 TEXT NOT NULL,
    Opcion4 TEXT NOT NULL,
    RespuestaCorrecta INTEGER NOT NULL CHECK (RespuestaCorrecta BETWEEN 1 AND 4),
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Respuesta (
    RespuestaId SERIAL PRIMARY KEY,
    PreguntaId INTEGER REFERENCES Pregunta(PreguntaId),
    UserId INTEGER NOT NULL,
    RespuestaSeleccionada INTEGER NOT NULL CHECK (RespuestaSeleccionada BETWEEN 1 AND 4),
    EsRespuestaCorrecta BOOLEAN,
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);     

INSERT INTO Pregunta (Pregunta, Opcion1, Opcion2, Opcion3, Opcion4, RespuestaCorrecta)
VALUES 
('¿Quién pintó la Mona Lisa?', 'Leonardo da Vinci', 'Pablo Picasso', 'Vincent van Gogh', 'Claude Monet', 1),
('¿Qué es el ADN?', 'Ácido desoxirribonucleico', 'Ácido ribonucleico', 'Ácido nucleico', 'Ácido clorhídrico', 1),
('¿En qué continente se encuentra el desierto del Sahara?', 'Asia', 'África', 'América', 'Europa', 2),
('¿Quién fue el primer presidente de los Estados Unidos?', 'Abraham Lincoln', 'George Washington', 'Thomas Jefferson', 'Franklin D. Roosevelt', 2),
('¿Cuál es el océano más grande del mundo?', 'Atlántico', 'Índico', 'Ártico', 'Pacífico', 4)
ON CONFLICT DO NOTHING;

INSERT INTO Respuesta (PreguntaId, UserId, RespuestaSeleccionada, EsRespuestaCorrecta)
VALUES 
(1, 101, 1, TRUE), 
(2, 102, 1, TRUE),  
(3, 103, 2, TRUE), 
(4, 104, 2, TRUE),  
(5, 105, 4, TRUE);