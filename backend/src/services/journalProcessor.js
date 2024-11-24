import OpenAI from '../config/openai.js';

export const journalProcessor = {
    async processJournalEntry(text, user_id) {
        try {
            const completion = await OpenAI.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: `Analiza el texto y extrae los hechos y emociones principales.
                        
                        REGLAS PARA HECHOS:
                        - Usa frases cortas (3-5 palabras máximo)
                        - Mantén el contexto importante
                        - Usa verbos en infinitivo (ej: "jugar fútbol con amigos")
                        - Evita detalles específicos de tiempo/lugar
                        - Normaliza actividades similares

                        EMOCIONES PERMITIDAS:
                        alegría, tristeza, enojo, miedo, sorpresa, amor, 
                        orgullo, vergüenza, culpa, gratitud, ansiedad, 
                        serenidad, frustración, entusiasmo, satisfacción, felicidad

                        FORMATO DE RESPUESTA:
                        {
                            "entries": [
                                {
                                    "hecho": "frase corta descriptiva",
                                    "emocion": "emoción de la lista"
                                }
                            ]
                        }

                        EJEMPLOS CORRECTOS:
                        ✅ "jugar fútbol con amigos" + "alegría"
                        ✅ "cocinar en familia" + "amor"
                        ✅ "presentar en trabajo" + "ansiedad"

                        EJEMPLOS INCORRECTOS:
                        ❌ "jugar un partido muy emocionante de fútbol" (muy largo)
                        ❌ "felicidad extrema" (emoción no en lista)
                        ❌ "jugué fútbol ayer" (tiempo específico)`
                    },
                    {
                        role: "user",
                        content: text
                    }
                ],
                temperature: 0.7,
                max_tokens: 2000
            });

            const response = JSON.parse(completion.choices[0].message.content);
            
            // Transformar y validar la respuesta
            return response.entries.map(entry => ({
                hecho: entry.hecho.toLowerCase(),
                emocion: entry.emocion.toLowerCase(),
                user_id
            }));

        } catch (error) {
            console.error('❌ Error en processJournalEntry:', error);
            throw error;
        }
    },
};