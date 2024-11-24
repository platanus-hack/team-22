import OpenAI from '../config/openai.js';
import { initializePinecone } from '../config/pinecone.js';
import { embeddingService } from '../services/embeddingService.js';

export async function getUserQueryVector(userId) {
    try {
        const index = await initializePinecone(); // Inicializar Pinecone
        
        const arbitraryVector = new Array(1536).fill(0);  // Vector de 128 dimensiones con valores aleatorios entre 0 y 1

        // Buscar las entradas del usuario en Pinecone utilizando el user_id
        const queryResponse = await index.query({
            vector: arbitraryVector, // No pasamos un vector para esta consulta; solo buscamos las entradas por user_id
            filter: { user_id: userId },  // Usamos el filtro para obtener las entradas del usuario
            topK: 1000,  // Número de entradas más cercanas a devolver
            includeMetadata: true , // Asegurarnos de que los metadatos estén incluidos (hecho, emoción, etc.)
            includeValues: true
        });
        
        // Extraer los vectores combinados de las entradas encontradas
        const userEntries = queryResponse.matches.map(match => ({
            metadata: match.metadata,  // Aquí tienes la metadata
            combinado: match.values  // Aquí añades el embedding combinado
        }));


        // Si no se encontraron entradas, devolver un vector vacío o lanzar un error
        if (!userEntries.length) {
            throw new Error('No se encontraron entradas para el usuario');
        }

        // Obtener el embedding combinado de cada entrada y devolver el promedio o el embedding más representativo
        const combinedVectors = userEntries.map(entry => entry.combinado); // Asumiendo que 'combinedEmbedding' es el nombre del campo del embedding combinado
    
        // Puedes devolver un único vector combinado representativo (promedio o más cercano, dependiendo de tu implementación)
        const userQueryVector = averageVectors(combinedVectors);

        return userQueryVector;
    } catch (error) {
        console.error('Error al obtener el vector de consulta del usuario:', error);
        throw error;
    }
}


export async function getTodayUserQueryVector(userId) {
    try {
        const index = await initializePinecone();
        const arbitraryVector = new Array(1536).fill(0);

        // Calcular timestamps para hoy
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startOfDay = Math.floor(today.getTime() / 1000);
        const endOfDay = Math.floor((today.getTime() + 24 * 60 * 60 * 1000) / 1000);

        console.log('Buscando entradas para:', {
            userId,
            startOfDay,
            endOfDay,
            startOfDayDate: new Date(startOfDay * 1000),
            endOfDayDate: new Date(endOfDay * 1000)
        });

        const queryResponse = await index.query({
            vector: arbitraryVector,
            filter: {
                user_id: userId
            },
            topK: 1000,
            includeMetadata: true,
            includeValues: true,
        });

        // Filtrar los resultados manualmente por timestamp
        const todayEntries = queryResponse.matches.filter(match => {
            const entryTimestamp = match.metadata.timestamp;
            return entryTimestamp >= startOfDay && entryTimestamp <= endOfDay;
        });

        if (!todayEntries.length) {
            throw new Error('No se encontraron entradas del usuario para el día de hoy');
        }

        // Obtener el embedding combinado de cada entrada y calcular el promedio
        const combinedVectors = todayEntries.map(entry => entry.values);
        const todayUserQueryVector = averageVectors(combinedVectors);

        return todayUserQueryVector;
    } catch (error) {
        console.error('Error al obtener el vector de consulta del usuario para hoy:', error);
        throw error;
    }
}

export async function getUserEntries(userId) {
    try {
        const index = await initializePinecone(); // Inicializar Pinecone
        
        // Buscar las entradas del usuario en Pinecone utilizando el user_id
        const queryResponse = await index.query({
            vector: [],  // No pasamos un vector para esta consulta; solo buscamos las entradas por user_id
            filter: { user_id: userId },  // Usamos el filtro para obtener las entradas del usuario
            topK: 100,  // Número de entradas más cercanas a devolver
            includeMetadata: true  // Asegurarnos de que los metadatos estén incluidos (hecho, emoción, etc.)
        });
        
        // Extraer los vectores combinados de las entradas encontradas
        const userEntries = queryResponse.matches.map(match => match.metadata);
        
        // Si no se encontraron entradas, devolver un vector vacío o lanzar un error
        if (!userEntries.length) {
            throw new Error('No se encontraron entradas para el usuario');
        }

        return userEntries;
    } catch (error) {
        console.error('Error al obtener las entradas del usuario:', error);
        throw error;
    }
}

// Función para promediar los vectores (puedes cambiar esta función si prefieres otro tipo de combinación)
export function averageVectors(vectors) {
    if (vectors.length === 0) return [];


    
    const averagedVector = new Array(1536).fill(0);

    vectors.forEach(vector => {
        vector.forEach((value, index) => {
            averagedVector[index] += value;
        });
    });

    return averagedVector.map(value => value / vectors.length);
}

export async function analyzeMood(userId) {
    const index = await initializePinecone();
    const userQueryVector = await getUserQueryVector(userId); // Obtener el vector combinado del usuario
    
    const queryResponse = await index.query({
        vector: userQueryVector,
        topK: 10,  // Número de vecinos más cercanos que deseas obtener
        includeMetadata: true,  // Asegúrate de incluir la metadata
    });
    
    // Solo trabajar con los k vecinos más cercanos que se devuelven de la consulta
    const similarEntries = queryResponse.matches.map(match => match.metadata);
    // Determinar la emoción más común entre estos vecinos cercanos
    const mood = determineMoodFromEntries(similarEntries); 

    return mood; // Devuelve la emoción correspondiente
}
// Asegúrate de tener la librería instalada para interactuar con OpenAI

export async function determineMoodFromEntries(entries) {
    // Recopilar todas las emociones de los entries
    const emotions = entries.map(entry => entry.emocion);
    // Generar una consulta a OpenAI basada en la lista de emociones
    const mood = await determineMoodFromOpenAI(emotions);

    return mood;
}

    export async function determineMoodFromOpenAI(emotions) {
    try {
        // Formatear la lista de emociones para enviar a OpenAI
        const emotionList = emotions.join(", ");

        // Enviar la lista de emociones a OpenAI para determinar el mood
        const response = await OpenAI.chat.completions.create({
            model: "gpt-4o-mini", // Actualizado el modelo
            messages: [
                {
                    role: "system",
                    content: "Eres un experto en análisis emocional que proporciona estados de ánimo optimistas y motivacionales."
                },
                {
                    role: "user",
                    content: `A continuación se presentan varias emociones: ${emotionList}. ¿Cuál es el estado de ánimo general asociado con estas emociones? no menciones las emociones, solo el estado de ánimo. Responde con un estado de ánimo optimista y motivacional, basado en las emociones proporcionadas.`
                }
            ],
            max_tokens: 150,
            temperature: 0.7
        });

        // Procesar la respuesta de OpenAI
        const mood = response.choices[0].message.content.trim();

        return mood;
    } catch (error) {
        console.error('Error al obtener el mood desde OpenAI:', error);
        return 'Estado de ánimo no disponible';
    }
}
export async function recommendFacts(userId) {
    try {
        // Buscar vectores similares a emociones positivas
        const searchText = "felicidad alegría optimismo entusiasmo";
        
        // Generar embedding para la búsqueda
        const searchEmbedding = await embeddingService.generateEmbeddings({
            hecho: searchText,
            emocion: searchText
        });

        // Buscar hechos similares usando el vector de emoción
        const similarEntries = await embeddingService.searchSimilar({
            vector: searchEmbedding.emocionVector,
            tipo: 'emocion',
            topK: 1000
        });

        // Filtrar solo los hechos del usuario específico
        const userEntries = similarEntries.filter(entry => 
            entry.metadata.user_id === userId
        );

        // Extraer y devolver los hechos recomendados
        const recommendations = userEntries.map(entry => ({
            hecho: entry.metadata.hecho,
            emocion: entry.metadata.emocion,
            score: entry.score
        }));
        // filtrar los que tengan score mayor a 0.7
        const filteredRecommendations = recommendations.filter(recommendation => recommendation.score > 0.84);

        // enviar un mensaje a openai con recomendaciones para el usuario basado en las filteredRecommendations que son las que lo hacen feliz
        const openaiRecommendations = await generateOpenAIRecommendations(filteredRecommendations);

        return openaiRecommendations;


    } catch (error) {
        console.error('Error al generar recomendaciones:', error);
        throw error;
    }
}

export async function generateOpenAIRecommendations(recommendations) {
    try {
        // Formatear las recomendaciones en un formato legible
        const formattedRecommendations = recommendations.map((rec, index) => 
            `${index + 1}. ${rec.hecho} (${(rec.score * 100).toFixed(1)}% de felicidad)`
        ).join("\n");

        // Construir el mensaje para OpenAI
        const response = await OpenAI.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "Eres un asistente que genera recomendaciones personalizadas basadas en actividades que hacen feliz a las personas."
                },
                {
                    role: "user",
                    content: `Estas son las actividades que hacen feliz a un usuario, ordenadas por cuánto le alegran: 
                    ${formattedRecommendations}
                    
                    Genera 3 recomendaciones en formato JSON,
                     cada una con una propiedad "mensaje", sugiriendo actividades para ser feliz.no seas directo en mencionar la felicidad, solo di cosas como "aprender un nuevo instrumento", "visita a un amigo", etc. No uses preguntas en las recomendaciones,
                     Las recomendaciones deben estar ligadas a las que te entregue y sus puntajes y no deben contener signos de exclamación, pregunta, etc. Haz recomendaciones cortas y directas.
                     el formato es el siguiente: 
                     {
                        "recommendations": [
                            {"mensaje": "..."},
                            {"mensaje": "..."},
                            {"mensaje": "..."}
                        ]
                    }
                    `
                }
            ],
            temperature: 0.7,
            max_tokens: 200,
            response_format: { type: "json_object" }
        });

        // Extraer y convertir la respuesta a JSON
        const generatedText = response.choices[0].message.content;
        const recommendationsJSON = JSON.parse(generatedText);

        return recommendationsJSON.recommendations || recommendationsJSON;
    } catch (error) {
        console.error("Error al generar recomendaciones con OpenAI:", error);
        throw error;
    }
}

export async function recommendGoodHabits(userId) {
    try {
        // Buscar vectores similares a emociones positivas
        const searchText = "felicidad alegría optimismo entusiasmo";
        
        // Generar embedding para la búsqueda
        const searchEmbedding = await embeddingService.generateEmbeddings({
            hecho: searchText,
            emocion: searchText
        });

        // Buscar hechos similares usando el vector de emoción
        const similarEntries = await embeddingService.searchSimilar({
            vector: searchEmbedding.emocionVector,
            tipo: 'emocion',
            topK: 1000
        });

        // Filtrar solo los hechos del usuario específico
        const userEntries = similarEntries.filter(entry => 
            entry.metadata.user_id === userId
        );

        // Agrupar hechos similares y contar ocurrencias
        const habitCounts = {};
        userEntries.forEach(entry => {
            if (entry.score > 0.84) { // Solo considerar hechos con alta similitud
                const habit = entry.metadata.hecho;
                habitCounts[habit] = (habitCounts[habit] || 0) + 1;
            }
        });

        // Convertir a array y ordenar por frecuencia
        const sortedHabits = Object.entries(habitCounts)
            .map(([habit]) => ({
                habit,
                score: userEntries.find(e => e.metadata.hecho === habit).score
            }))

        // Generar mensaje personalizado con OpenAI
        const response = await OpenAI.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "Eres un asistente que identifica y refuerza buenos hábitos"
                },
                {
                    role: "user",
                    content: `Estos son los buenos hábitos repetidos del usuario:
                    ${sortedHabits.map(h => 
                        `${h.habit} , ${(h.score * 100)}% de felicidad)`
                    ).join("\n")}
                    
                    Genera exactamente 3 recomendaciones o menos si no hay suficiente info en el siguiente formato JSON:
                    {
                        "recommendations": [
                            {"mensaje": ".. es un buen hábito"},
                            {"mensaje": "...."},
                            {"mensaje": "..."}
                        ]
                    }
                    Usa un tono optimista e informal en español (chileno).".`
                }
            ],
            temperature: 0.7,
            max_tokens: 200,
            response_format: { type: "json_object" }
        });

        const generatedText = response.choices[0].message.content;
        return JSON.parse(generatedText).recommendations || JSON.parse(generatedText);

    } catch (error) {
        console.error('Error al obtener buenos hábitos:', error);
        throw error;
    }
}

export async function recommendDoBetter(userId) {
    try {
        // Buscar vectores similares a emociones positivas
        const searchText = "enojo tristeza frustración";
        
        // Generar embedding para la búsqueda
        const searchEmbedding = await embeddingService.generateEmbeddings({
            hecho: searchText,
            emocion: searchText
        });

        // Buscar hechos similares usando el vector de emoción
        const similarEntries = await embeddingService.searchSimilar({
            vector: searchEmbedding.emocionVector,
            tipo: 'emocion',
            topK: 1000
        });

        // Filtrar solo los hechos del usuario específico
        const userEntries = similarEntries.filter(entry => 
            entry.metadata.user_id === userId
        );

        // Agrupar hechos similares y contar ocurrencias
        const habitCounts = {};
        userEntries.forEach(entry => {
            if (entry.score > 0.88) { // Solo considerar hechos con alta similitud
                const habit = entry.metadata.hecho;
                habitCounts[habit] = (habitCounts[habit] || 0) + 1;
            }
        });

        // Convertir a array y ordenar por frecuencia
        const sortedHabits = Object.entries(habitCounts)
            .map(([habit]) => ({
                habit,
                score: userEntries.find(e => e.metadata.hecho === habit).score
            }))

        // Generar mensaje personalizado con OpenAI
        const response = await OpenAI.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "Eres un asistente que identifica y refuerza cosas por mejorar"
                },
                {
                    role: "user",
                    content: `Estas son cosas que hacen que un usuario se sienta mal:
                    ${sortedHabits.map(h => 
                        `${h.habit} , ${(h.score * 100)}% de felicidad)`
                    ).join("\n")}
                    
                    Genera exactamente 3 recomendaciones en el siguiente formato JSON:
                    {
                        "recommendations": [
                            {"mensaje": "Podrías mejorar..."},
                            {"mensaje": "Podrías mejorar..."},
                            {"mensaje": "Podrías mejorar..."}
                        ]
                    }
                    Usa un tono optimista e informal en español (chileno). Cada mensaje debe comenzar con "Podrías mejorar".`
                }
            ],
            temperature: 0.7,
            max_tokens: 200,
            response_format: { type: "json_object" }
        });

        const generatedText = response.choices[0].message.content;
        return JSON.parse(generatedText).recommendations || JSON.parse(generatedText);

    } catch (error) {
        console.error('Error al obtener buenos hábitos:', error);
        throw error;
    }
    
    
}