import axios from 'axios';
import { supabase } from '../supabase';
const API_URL = import.meta.env.VITE_API_URL;

export const fetchUserProfile = async (userId: string) => {
  try {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', userId)
      .single();
    if (userError) throw userError;
    return userData;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch user profile');
  }
};

export const updateUserProfile = async (
  userId: string,
  updates: Partial<any>
) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to update user profile');
  }
};

export const analyzeMood = async (userId: string): Promise<string> => {
  try {
    const response = await axios.post(`${API_URL}/mood`, { userId });
    return response.data.mood.mensaje;
  } catch (error) {
    console.error('Error analyzing mood:', error);
    throw new Error('Failed to analyze mood');
  }
};

type Recommendations = {
  recommendations: string[];
};

export const getRecommendations = async (
  userId: string
): Promise<{ mensaje: string }[]> => {
  try {
    const response = await axios.post(`${API_URL}/recommendations`, { userId });
    return response.data.recommendations;
  } catch (error) {
    console.error('Error getting recommendations:', error);
    throw new Error('Failed to get recommendations');
  }
};

export const getDoBetterRecommendations = async (
  userId: string
): Promise<{ mensaje: string }[]> => {
  try {
    const response = await axios.post(`${API_URL}/dobetter`, { userId });

    return response.data.recommendations;
  } catch (error) {
    console.error('Error getting do better recommendations:', error);
    throw new Error('Failed to get do better recommendations');
  }
};

export type GoodHabit = {
  mensaje: string;
};

export type GoodHabits = {
  goodhabits: GoodHabit[];
};

export const getGoodHabits = async (userId: string): Promise<GoodHabits> => {
  try {
    const response = await axios.post(`${API_URL}/goodhabits`, { userId });

    return response.data;
  } catch (error) {
    console.error('Error getting good habits:', error);
    throw new Error('Failed to get good habits');
  }
};
