import express from 'express';
import { factService } from '../services/factService.js';
import { journalProcessor } from '../services/journalProcessor.js';
import { aiService } from '../services/aiService.js';
import { embeddingService } from '../services/embeddingService.js';
import { getEmotionalInsights, getEmotionsFromFact } from '../utils/insightAnalyzer.js';
import { getUserEntries, analyzeMood, determineMoodFromEntries, recommendFacts, recommendDoBetter, recommendGoodHabits } from '../utils/userRequests.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Yournal API is running' });
});


router.post('/journal-fast-response', async (req, res) => {
    try {
      console.log('🚀 Iniciando respuesta rápida con payload:', req.body);
      const payload = req.body;
  
      const results = await aiService.getQuickAnalysis(payload);
      console.log("retornando ctm");
      res.json(results);
    } catch (error) {
      console.error('Error en POST /journal-fast-response:', error);
      res.status(500).json({ error: error.message });
    }
  });

router.post('/chat', async (req, res) => {
  try {
    console.log('🚀 Iniciando chat con payload:', req.body);
    const payload = req.body;

    const results = await aiService.processInput(payload);
    res.json(results);
  } catch (error) {
    console.error('Error en POST /chat:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para crear embeddings y almacenarlos en Pinecone
router.post('/embeddings', async (req, res) => {
    try {
        const { hecho, emocion, user_id } = req.body;

        if (!hecho || !emocion || !user_id) {
            return res.status(400).json({ 
                error: 'Se requieren los campos "hecho", "emocion" y "user_id"' 
            });
        }

        console.log('📥 Procesando:', { hecho, emocion, user_id });

        // 1. Generar embeddings
        const vectors = await embeddingService.generateEmbeddings({ 
            hecho, 
            emocion 
        });

        // 2. Almacenar en Pinecone
        await embeddingService.storeVectors({ 
            hecho, 
            emocion, 
            vectors,
            user_id 
        });

        res.json({ 
            success: true, 
            message: 'Embeddings generados y almacenados',
            data: { hecho, emocion, user_id }
        });

    } catch (error) {
        console.error('❌ Error en POST /embeddings:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/mood', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'Falta el ID de usuario.' });
  }

  try {

    const mood = await analyzeMood(userId);

    return res.status(200).json({
      mood,
    });
  } catch (error) {
    console.error('Error al procesar las recomendaciones:', error);
    return res.status(500).json({ error: 'Error al obtener el estado de ánimo y las recomendaciones.' });
  }
});

router.post('/recommendations', async (req, res) => {
  const { userId } = req.body;
  const recommendations = await recommendFacts(userId);
  console.log(recommendations);
  return res.status(200).json({ recommendations });
});

router.post('/dobetter', async (req, res) => {
  const { userId } = req.body;
  const recommendations = await recommendDoBetter(userId);
  return res.status(200).json({ recommendations });
});

router.post('/goodhabits', async (req, res) => {
  const { userId } = req.body;
  const goodhabits = await recommendGoodHabits(userId);
  return res.status(200).json({ goodhabits });
});

// Endpoint para buscar similitudes
router.post('/search', async (req, res) => {
    try {
        const { texto, tipo = 'hecho', topK = 5 } = req.body;

        if (!texto) {
            return res.status(400).json({ 
                error: 'Se requiere el campo "texto"' 
            });
        }

        // 1. Generar embedding para el texto de búsqueda
        const searchEmbedding = await embeddingService.generateEmbeddings({ 
            hecho: texto, 
            emocion: texto // usamos el mismo texto para ambos ya que solo necesitamos uno
        });

        // 2. Buscar similitudes usando el vector correspondiente
        const vector = tipo === 'hecho' ? searchEmbedding.hechoVector : searchEmbedding.emocionVector;
        const results = await embeddingService.searchSimilar({ 
            vector,
            tipo,
            topK 
        });

        res.json({ 
            success: true,
            results: results.map(match => ({
                hecho: match.metadata.hecho,
                emocion: match.metadata.emocion,
                score: match.score,
                user_id: match.metadata.user_id
            }))
        });

    } catch (error) {
        console.error('❌ Error en POST /search:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/insights/emotion', async (req, res) => {
    try {
        const { userId, emotion } = req.body;

        if (!userId || !emotion) {
            return res.status(400).json({ 
                error: 'Se requieren los campos "userId" y "emotion"' 
            });
        }

        console.log('🔍 Buscando insights emocionales para:', { userId, emotion });

        const insights = await getEmotionalInsights(userId, emotion);
        
        res.json({ 
            success: true,
            data: insights
        });

    } catch (error) {
        console.error('❌ Error en POST /insights:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/insights/fact', async (req, res) => {
    try {
        const { userId, fact } = req.body;

        if (!userId || !fact) {
            return res.status(400).json({ 
                error: 'Se requieren los campos "userId" y "fact"' 
            });
        }

        console.log('🔍 Buscando insights para el hecho:', { userId, fact });

        const insights = await getEmotionsFromFact(userId, fact);
        
        res.json({ 
            success: true,
            data: insights
        });

    } catch (error) {
        console.error('❌ Error en POST /insights/fact:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/ai-insight', async (req, res) => {
    try {
        const { userId, question } = req.body;

        if (!userId || !question) {
            return res.status(400).json({ 
                error: 'Se requieren los campos "userId" y "question"' 
            });
        }


        console.log('🤖 Procesando pregunta:', { userId: userId, question });

        const response = await aiService.getInsightResponse(userId, question);
        console.log("respuesta", response);
        
        res.json({ 
            success: true,
            data: response
        });

    } catch (error) {
        console.error('❌ Error en POST /ai-insight:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
