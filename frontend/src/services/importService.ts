import { supabase } from '../lib/supabase';

export const importService = {
  async executeBulkImport(tableName: string, data: any[]) {
    // We assume the JSON array has objects matching the table schema.
    // For large imports, it's safer to chunk, but we'll send it all at once for now.
    
    // UPSERT relies on primary keys existing in the payload or unique constraints.
    const { data: result, error } = await supabase
      .from(tableName as any)
      .upsert(data)
      .select();

    if (error) {
      console.error('Import Error:', error);
      throw error;
    }

    return result;
  }
};
