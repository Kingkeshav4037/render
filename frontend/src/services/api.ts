/**
 * Base API Configuration
 */
import { supabase } from '../lib/supabase';

const isProd = import.meta.env.PROD;
const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_ML_API_URL;

if (isProd && !envUrl) {
  console.warn('[Norway SmartLife] Production ML API URL is missing! Set VITE_API_URL or VITE_ML_API_URL in your deployment environment.');
}

const rawApiUrl = (envUrl || 'http://localhost:8000').replace(/\/+$/, '');
export const ML_API_BASE_URL = rawApiUrl.endsWith('/api/v1') ? rawApiUrl : `${rawApiUrl}/api/v1`;


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
