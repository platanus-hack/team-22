import { supabase } from '../supabase/index';

export const loginWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    const { data } = await supabase.auth.getSession();
    return data.session;
  } catch (error) {
    console.error(error);
    throw new Error('Invalid credentials');
  }
};

export const registerWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'http://localhost:3000/auth/email-confirmation',
      },
    });
    if (error) throw error;

    return data.user;
  } catch (error) {
    console.error(error);
    throw new Error('Registration failed');
  }
};

export const createUserProfile = async (user: any): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([{ email: user.email, auth_id: user.id }])
      .select('id')
      .single();
    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to insert user profile');
  }
};

export const resendVerificationEmail = async (email: string) => {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: 'http://localhost:3000/verify-email',
      },
    });
    if (error) throw error;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to resend verification email');
  }
};

export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `http://localhost:3000/app/dashboard`,
    },
  });
  if (error) {
    console.error('Error signing in with Google:', error.message);
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error signing out:', error.message);
  }
};
