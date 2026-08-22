/**
 * Base API Configuration
 */
import { supabase } from '../lib/supabase';

// Base URL for the local FastAPI ML Service
export const ML_API_BASE_URL = 'http://localhost:8000/api/v1';

/**
 * Helper to invoke Supabase Edge Functions securely
 */
export const invokeEdgeFunction = async <T>(functionName: string, payload: any): Promise<T> => {
  const { data, error } = await supabase.functions.invoke(functionName, {
    body: payload,
  });

  if (error) {
    console.error(`Edge Function Error [${functionName}]:`, error);
    throw new Error(error.message || 'Failed to call edge function');
  }

  // Edge functions should return { success: boolean, ...data }
  if (data && data.success === false) {
    throw new Error(data.message || 'Action failed');
  }

  return data as T;
};
