import OpenAI from '../config/openai.js';
import { initializePinecone } from '../config/pinecone.js';
import { embeddingService } from '../services/embeddingService.js';

export async function getEmotionalInsights(userId, targetEmotion) {
    try {
        // Agregar log para debug
        console.log('🔍 Buscando insights para:', { userId, targetEmotion });

        const emotionEmbedding = await embeddingService.generateEmbeddings({
            hecho: targetEmotion,
            emocion: targetEmotion
        });

        const index = await initializePinecone();
        
        // Primera búsqueda
        const queryResponse = await index.query({
            vector: emotionEmbedding.emocionVector,
            topK: 10,
            includeMetadata: true,
            filter: { 
                user_id: userId,
                tipo: 'emocion'
            }
        });

        // Agregar log para ver resultados iniciales
        console.log('📊 Matches encontrados:', queryResponse.matches.length);
        console.log('🎯 Scores:', queryResponse.matches.map(m => m.score));

        // Reducir el umbral de similitud
        const relevantPairIds = queryResponse.matches
            .filter(match => match.score > 0.6) // Umbral más permisivo
            .map(match => match.metadata.pair_id);

        // Log para debug
        console.log('🔗 Pairs relevantes encontrados:', relevantPairIds.length);

        // Segunda búsqueda
        const factsResponse = await index.query({
            vector: emotionEmbedding.emocionVector,
            topK: Math.max(1, relevantPairIds.length),
            includeMetadata: true,
            filter: { 
                user_id: userId,
                tipo: 'hecho',
                pair_id: { $in: relevantPairIds }
            }
        });

        const relevantEntries = factsResponse.matches.map(match => ({
            hecho: match.metadata.hecho,
            emocion: match.metadata.emocion,
            score: match.score,
            user_id: match.metadata.user_id
        }));

        if (relevantEntries.length === 0) {
            return {
                success: true,
                emotion: targetEmotion,
                response_to_user: `He revisado tu diario y no encontré experiencias significativas relacionadas con ${targetEmotion}. ¡Esto no es malo! Significa que esta emoción no ha sido predominante en tus registros. ¿Te gustaría contarme más sobre cómo te sientes con ${targetEmotion}?`,
                entries: []
            };
        }

        const response_to_user = await analyzeEmotionalPatterns(relevantEntries, targetEmotion);

        return {
            success: true,
            emotion: targetEmotion,
            response_to_user,
            entries: relevantEntries
        };

    } catch (error) {
        console.error('Error al obtener insights emocionales:', error);
        // Agregar más detalles al error
        console.error('Detalles:', {
            userId,
            targetEmotion,
            error: error.message,
            stack: error.stack
        });
        throw error;
    }
}

async function analyzeEmotionalPatterns(entries, targetEmotion) {
    try {
        const response = await OpenAI.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `Analiza los patrones emocionales en las entradas proporcionadas.
                    Instrucciones:
                    - Identifica patrones claros y frecuentes
                    - Agrupa situaciones similares
                    - Identifica factores desencadenantes comunes
                    - Si es una emoción positiva, enfócate solo en experiencias positivas
                    - Para emociones negativas, identifica también elementos positivos si existen
                    
                    Estructura tu respuesta en JSON con:
                    {
                        "patterns": ["lista de patrones principales identificados"],
                        "triggers": ["situaciones o factores desencadenantes"],
                        "frequency": "frecuencia observada (alta/media/baja)",
                        "related_emotions": ["emociones relacionadas encontradas"],
                        "context": "breve descripción del contexto general"
                    }`
                },
                {
                    role: "user",
                    content: `Analiza estas experiencias relacionadas con "${targetEmotion}":
                    ${JSON.stringify(entries, null, 2)}`
                }
            ],
            response_format: { type: "json_object" }
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error('Error al analizar patrones emocionales:', error);
        return JSON.stringify({
            patterns: [],
            triggers: [],
            frequency: "no determinada",
            related_emotions: [],
            context: `Error al analizar patrones para ${targetEmotion}`
        });
    }
}

export async function getEmotionsFromFact(userId, targetFact) {
    try {
        // Generar embedding específico para el hecho
        const factEmbedding = await embeddingService.generateEmbeddings({
            hecho: targetFact,
            emocion: 'neutral'
        });

        const index = await initializePinecone();
        
        // Buscar usando el vector del hecho
        const queryResponse = await index.query({
            vector: factEmbedding.hechoVector,
            topK: 10,
            includeMetadata: true,
            filter: { 
                user_id: userId,
                tipo: 'hecho'
            }
        });

        // Obtener los pair_ids de los matches relevantes
        const relevantPairIds = queryResponse.matches
            .filter(match => match.score > 0.85)
            .map(match => match.metadata.pair_id);

        // Buscar las emociones correspondientes usando los pair_ids
        const emotionsResponse = await index.query({
            vector: factEmbedding.hechoVector,
            topK: Math.max(1, relevantPairIds.length),
            includeMetadata: true,
            filter: { 
                user_id: userId,
                tipo: 'emocion',
                pair_id: { $in: relevantPairIds }
            }
        });

        const relevantEntries = emotionsResponse.matches.map(match => ({
            hecho: match.metadata.hecho,
            emocion: match.metadata.emocion,
            score: match.score,
            user_id: match.metadata.user_id
        }));

        if (relevantEntries.length === 0) {
            return {
                success: true,
                fact: targetFact,
                response_to_user: `He revisado tu diario y no encontré experiencias similares a "${targetFact}". ¿Te gustaría contarme más sobre cómo te hace sentir esta situación?`,
                entries: []
            };
        }

        const response_to_user = await analyzeFactPatterns(relevantEntries, targetFact);

        return {
            success: true,
            fact: targetFact,
            response_to_user,
            entries: relevantEntries
        };

    } catch (error) {
        console.error('Error al obtener emociones por hecho:', error);
        throw error;
    }
}

async function analyzeFactPatterns(entries, targetFact) {
    try {
        const response = await OpenAI.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `Analiza cómo esta actividad o situación afecta emocionalmente al usuario.
                    Instrucciones:
                    - Identifica las emociones más frecuentes
                    - Detecta patrones en el impacto emocional
                    - Analiza el contexto de la actividad
                    - Identifica variaciones según circunstancias
                    
                    Estructura tu respuesta en JSON con:
                    {
                        "primary_emotions": ["emociones principales asociadas"],
                        "emotional_impact": "descripción del impacto emocional general",
                        "context_variations": ["diferentes contextos identificados"],
                        "frequency": "frecuencia de la actividad (alta/media/baja)",
                        "associated_activities": ["actividades relacionadas encontradas"]
                    }`
                },
                {
                    role: "user",
                    content: `Analiza estas experiencias relacionadas con "${targetFact}":
                    ${JSON.stringify(entries, null, 2)}`
                }
            ],
            response_format: { type: "json_object" }
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error('Error al analizar patrones de hechos:', error);
        return JSON.stringify({
            primary_emotions: [],
            emotional_impact: "no determinado",
            context_variations: [],
            frequency: "no determinada",
            associated_activities: []
        });
    }
}