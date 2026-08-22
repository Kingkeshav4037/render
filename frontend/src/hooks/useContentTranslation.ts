import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { translationService } from '../services/translationService';

export function useContentTranslation(entityType: string, entityId?: string) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const query = useQuery({
    queryKey: ['content_translations', entityType, entityId, currentLang],
    queryFn: async () => {
      if (!entityId || currentLang === 'en') return {};
      return translationService.getTranslations(entityType, entityId, currentLang);
    },
    enabled: !!entityId && currentLang !== 'en',
    staleTime: 10 * 60 * 1000,
  });

  return {
    translations: query.data || {},
    isLoading: query.isLoading,
    currentLang,
    translateEntity: <T extends Record<string, any>>(entity: T): T => {
      return translationService.applyTranslations(entity, query.data);
    }
  };
}

export function useBatchContentTranslation(entityType: string, entityIds: string[]) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const query = useQuery({
    queryKey: ['content_translations_batch', entityType, entityIds, currentLang],
    queryFn: async () => {
      if (entityIds.length === 0 || currentLang === 'en') return {};
      return translationService.getBatchTranslations(entityType, entityIds, currentLang);
    },
    enabled: entityIds.length > 0 && currentLang !== 'en',
    staleTime: 10 * 60 * 1000,
  });

  return {
    batchTranslations: query.data || {},
    isLoading: query.isLoading,
    currentLang,
    translateEntity: <T extends { id: string }>(entity: T): T => {
      const entityTranslations = query.data?.[entity.id];
      return translationService.applyTranslations(entity, entityTranslations);
    },
    translateList: <T extends { id: string }>(list: T[]): T[] => {
      if (!query.data || Object.keys(query.data).length === 0) return list;
      return list.map(item => translationService.applyTranslations(item, query.data?.[item.id]));
    }
  };
}
