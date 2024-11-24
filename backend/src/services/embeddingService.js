import openai from '../config/openai.js';
import { initializePinecone } from '../config/pinecone.js';

export const embeddingService = {
    async generateEmbeddings({ hecho, emocion }) {
        try {
            // Generar embeddings usando OpenAI
            const [hechoEmbed, emocionEmbed] = await Promise.all([
                openai.embeddings.create({
                    model: "text-embedding-ada-002",
                    input: hecho,
                }),
                openai.embeddings.create({
                    model: "text-embedding-ada-002",
                    input: emocion,
                })
            ]);

            const hechoVector = hechoEmbed.data[0].embedding;
            const emocionVector = emocionEmbed.data[0].embedding;

            // Combinar vectores (promedio simple)
            const combinedVector = hechoVector.map((val, i) => 
                (val * emocionVector[i])
            );
            // console.log(combinedVector);

            return {
                hechoVector,
                emocionVector,
                combinedVector
            };
        } catch (error) {
            console.error('❌ Error generando embeddings:', error);
            throw error;
        }
    },

    async storeVectors({ hecho, emocion, vectors, user_id }) {
        try {
            const index = await initializePinecone();
            
            // ID base sanitizado
            const baseId = `${user_id}-${Date.now()}`
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-zA-Z0-9-_]/g, '_');
            
            // Crear registros para hecho y emoción
            const records = [
                {
                    id: `${baseId}-hecho`,
                    values: vectors.hechoVector,
                    metadata: {
                        hecho,
                        emocion,
                        user_id,
                        tipo: 'hecho',
                        timestamp: new Date().toISOString(),
                        pair_id: baseId  // ID para relacionar pares hecho-emoción
                    }
                },
                {
                    id: `${baseId}-emocion`,
                    values: vectors.emocionVector,
                    metadata: {
                        hecho,
                        emocion,
                        user_id,
                        tipo: 'emocion',
                        timestamp: new Date().toISOString(),
                        pair_id: baseId  // ID para relacionar pares hecho-emoción
                    }
                },
                {
                    id: `${baseId}-combined`,
                    values: vectors.combinedVector,
                    metadata: {
                        hecho,
                        emocion,
                        user_id,
                        tipo: 'combinado',
                        timestamp: new Date().toISOString(),
                        pair_id: baseId  // ID para relacionar pares hecho-emoción
                    }
                }
            ];

            await index.upsert(records);
            console.log('✅ Vectores almacenados en Pinecone para usuario:', user_id);
        } catch (error) {
            console.error('❌ Error almacenando vectores:', error);
            throw error;
        }
    },

    async searchSimilar({ vector, tipo = 'hecho', topK = 5 }) {
        try {
            const index = await initializePinecone();
            
            const queryRequest = {
                vector,
                topK,
                includeMetadata: true,
                filter: { tipo }  // Filtrar por tipo de vector
            };

            const results = await index.query(queryRequest);
            return results.matches;
        } catch (error) {
            console.error('❌ Error buscando vectores similares:', error);
            throw error;
        }
    }
};