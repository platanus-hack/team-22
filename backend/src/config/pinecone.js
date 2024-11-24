import { Pinecone } from '@pinecone-database/pinecone';

if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_INDEX_NAME) {
    throw new Error('Faltan variables de entorno de Pinecone');
}

let pineconeInstance = null;

export async function initializePinecone() {
    if (!pineconeInstance) {
        console.log('🌲 Inicializando Pinecone...');
        
        pineconeInstance = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY,
        });
    }

    const index = pineconeInstance.Index(process.env.PINECONE_INDEX_NAME);
    return index;
}