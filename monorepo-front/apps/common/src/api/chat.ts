import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const sendMessageOrAudio = async (data: any) => {
  try {
    // Ya no necesitamos FormData porque ahora enviamos la URL directamente
    const response = await axios.post(`${API_URL}/chat`, data);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const sendJournalFastResponse = async (data: any) => {
  try {
    const response = await axios.post(`${API_URL}/journal-fast-response`, data);
    return response.data;
  } catch (error) {
    console.error('Error sending journal fast response:', error);
    throw error;
  }
};

export const getAiInsight = async (userId: string, question: string) => {
  try {
    const response = await axios.post(`${API_URL}/ai-insight`, {
      userId,
      question,
    });
    return response.data;
  } catch (error) {
    console.error('Error getting ai insight:', error);
    throw error;
  }
};
