import { supabase } from "../config/supabase.js";

export const factService = {
    // Create/Update fact with emotions
    async upsertFact({ hecho, tema, emociones }) {
        try {
            const { data: existingFact, error: selectError } = await supabase
                .from('hechos')
                .select('*')
                .match({ hecho, tema })
                .single();

            if (selectError && selectError.code !== 'PGRST116') {
                throw selectError;
            }

            const updates = {
                hecho,
                tema,
                count: existingFact ? existingFact.count + 1 : 1,
            };

            Object.entries(emociones)
                .filter(([_, valor]) => valor > 0)
                .forEach(([emocion, valor]) => {
                    updates[emocion] = existingFact ? 
                        (existingFact[emocion] || 0) + valor : 
                        valor;
                });


            const { error: upsertError } = await supabase
                .from('hechos')
                .upsert(updates, {
                    onConflict: 'hecho,tema',
                    returning: 'minimal'
                });

            if (upsertError) throw upsertError;

            const { data: fullFact, error: getError } = await supabase
                .from('hechos')
                .select('*')
                .match({ hecho, tema })
                .single();

            if (getError) throw getError;

            const updatedFact = {
                hecho: fullFact.hecho,
                tema: fullFact.tema,
                count: fullFact.count,
                emociones: Object.fromEntries(
                    Object.entries(fullFact)
                        .filter(([key, valor]) => 
                            !['id', 'hecho', 'tema', 'count', 'created_at', 'updated_at'].includes(key) 
                            && valor > 0
                        )
                )
            };

            console.log('✅ Hecho actualizado:', updatedFact);
            return updatedFact;
        } catch (error) {
            console.error('❌ Error en upsertFact:', error);
            throw error;
        }
    },

    // Read a specific fact
    async getFact(hecho, tema) {
        const { data, error } = await supabase
            .from('hechos')
            .select('*')
            .match({ hecho, tema })
            .single();

        if (error) throw error;
        return data;
    },

    // Read all facts by theme
    async getFactsByTheme(tema) {
        const { data, error } = await supabase
            .from('hechos')
            .select('*')
            .eq('tema', tema);

        if (error) throw error;
        return data;
    },

    // Get emotional averages for a fact
    async getFactAverages(hecho, tema) {
        const { data, error } = await supabase
            .from('hechos')
            .select('*')
            .match({ hecho, tema })
            .single();

        if (error) throw error;

        const averages = {};
        // Calculamos promedios para cada emoción
        Object.entries(data)
            .filter(([key]) => key !== 'hecho' && key !== 'tema' && key !== 'count' && key !== 'id' && key !== 'creado_en' && key !== 'actualizado_en')
            .forEach(([emocion, valor]) => {
                averages[emocion] = valor / data.count;
            });

        return {
            hecho: data.hecho,
            tema: data.tema,
            count: data.count,
            promedios: averages
        };
    },

    // Obtener estructura de referencia para el análisis
    async getReferenceStructure() {
        try {
            // 1. Obtener todos los hechos (incluyendo "otro")
            const { data: facts, error } = await supabase
                .from('hechos')
                .select('hecho, tema')
                .order('tema');

            if (error) throw error;

            // 2. Organizamos los hechos por tema manteniendo la relación exacta
            const referenceData = facts.reduce((acc, { hecho, tema }) => {
                // Normalizamos el tema para consistencia
                const normalizedTema = tema.charAt(0).toUpperCase() + tema.slice(1).toLowerCase();
                
                if (!acc[normalizedTema]) {
                    acc[normalizedTema] = [];
                }
                // Solo agregamos el hecho si no está ya en el array
                if (!acc[normalizedTema].includes(hecho)) {
                    acc[normalizedTema].push(hecho);
                }
                return acc;
            }, {});

            // 3. Obtenemos las columnas de emociones
            const { data: [sampleRow], error: columnError } = await supabase
                .from('hechos')
                .select('*')
                .limit(1);

            if (columnError) throw columnError;

            // 4. Filtramos para obtener solo las columnas numéricas (emociones)
            const emotionColumns = Object.keys(sampleRow).filter(key => 
                !['id', 'hecho', 'tema', 'count', 'created_at', 'updated_at', 'creado_en'].includes(key) 
                && typeof sampleRow[key] === 'number'
            );

            // 5. Agregamos información de debug
            console.log('📊 Estadísticas de hechos:');
            Object.entries(referenceData).forEach(([tema, hechos]) => {
                console.log(`- ${tema}: ${hechos.length} hechos`);
                console.log(`  Hechos: ${hechos.join(', ')}`);
            });

            return {
                temas: referenceData,
                emociones: emotionColumns
            };
        } catch (error) {
            console.error('Error obteniendo estructura de referencia:', error);
            throw error;
        }
    }
};
