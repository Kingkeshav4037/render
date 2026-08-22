import { supabase } from '../lib/supabase';

export interface ContentTranslation {
  id: string;
  entity_type: string;
  entity_id: string;
  language_code: string;
  field_name: string;
  translated_text: string;
}

export const translationService = {
  /**
   * Fetch translations for a single entity in a given language.
   * Returns a key-value record of { [fieldName]: translatedText }
   */
  async getTranslations(
    entityType: string,
    entityId: string,
    languageCode: string
  ): Promise<Record<string, string>> {
    if (!languageCode || languageCode === 'en') return {};

    const { data, error } = await supabase
      .from('content_translations')
      .select('field_name, translated_text')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .eq('language_code', languageCode);

    if (error || !data) {
      console.warn(`Error fetching translations for ${entityType}/${entityId}:`, error);
      return {};
    }

    return data.reduce((acc, row) => {
      acc[row.field_name] = row.translated_text;
      return acc;
    }, {} as Record<string, string>);
  },

  /**
   * Fetch translations for a batch of entities in a given language.
   * Returns a map of entityId -> { [fieldName]: translatedText }
   */
  async getBatchTranslations(
    entityType: string,
    entityIds: string[],
    languageCode: string
  ): Promise<Record<string, Record<string, string>>> {
    if (!languageCode || languageCode === 'en' || entityIds.length === 0) return {};

    const { data, error } = await supabase
      .from('content_translations')
      .select('entity_id, field_name, translated_text')
      .eq('entity_type', entityType)
      .in('entity_id', entityIds)
      .eq('language_code', languageCode);

    if (error || !data) {
      console.warn(`Error batch fetching translations for ${entityType}:`, error);
      return {};
    }

    const resultMap: Record<string, Record<string, string>> = {};
    for (const row of data) {
      if (!resultMap[row.entity_id]) {
        resultMap[row.entity_id] = {};
      }
      resultMap[row.entity_id][row.field_name] = row.translated_text;
    }
    return resultMap;
  },

  /**
   * Upsert a translation for an entity field.
   */
  async setTranslation(
    entityType: string,
    entityId: string,
    languageCode: string,
    fieldName: string,
    translatedText: string
  ): Promise<boolean> {
    const { error } = await supabase
      .from('content_translations')
      .upsert(
        {
          entity_type: entityType,
          entity_id: entityId,
          language_code: languageCode,
          field_name: fieldName,
          translated_text: translatedText,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'entity_type,entity_id,language_code,field_name' }
      );

    if (error) {
      console.error('Error saving translation:', error);
      return false;
    }
    return true;
  },

  /**
   * Helper function to overlay translations onto an object.
   */
  applyTranslations<T extends Record<string, any>>(
    entity: T,
    translations?: Record<string, string>
  ): T {
    if (!translations || Object.keys(translations).length === 0) return entity;
    const translated = { ...entity };
    for (const [key, value] of Object.entries(translations)) {
      if (key in translated && value) {
        (translated as any)[key] = value;
      }
    }
    return translated;
  }
};
