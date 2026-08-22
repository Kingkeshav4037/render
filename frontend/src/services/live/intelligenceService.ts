import { useRealtimeStore } from '../../store/useRealtimeStore';

export interface IntelligenceRecommendation {
  id: string;
  type: 'AURORA' | 'WEATHER' | 'TRANSPORT' | 'SAFETY';
  title: string;
  description: string;
  locationId?: string;
  actionText?: string;
  actionType?: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export const useLiveIntelligence = (): IntelligenceRecommendation[] => {
  const weather = useRealtimeStore((state) => state.weather);
  const aurora = useRealtimeStore((state) => state.aurora);
  const alerts = useRealtimeStore((state) => state.alerts);
  const ferries = useRealtimeStore((state) => state.ferries);

  const recommendations: IntelligenceRecommendation[] = [];

  // 1. Aurora Intelligence Rules
  Object.values(aurora).forEach((forecast) => {
    const locId = forecast.location_id;
    const w = weather[locId];

    if (forecast.probability_pct > 60 && forecast.kp_index >= 4) {
      if (w && w.cloud_cover_pct < 30 && w.visibility_km > 10) {
        recommendations.push({
          id: `aurora-high-${locId}`,
          type: 'AURORA',
          title: 'Perfect Aurora Conditions Tonight',
          description: `High solar activity combined with clear skies makes tonight an excellent opportunity to see the Northern Lights.`,
          locationId: locId,
          actionText: 'View Aurora Activities',
          actionType: 'FILTER_AURORA',
          priority: 'HIGH'
        });
      } else if (w && w.cloud_cover_pct >= 70) {
        recommendations.push({
          id: `aurora-blocked-${locId}`,
          type: 'WEATHER',
          title: 'Aurora Blocked by Clouds',
          description: `Despite high solar activity, heavy cloud cover (${w.cloud_cover_pct}%) will likely block visibility tonight.`,
          locationId: locId,
          priority: 'MEDIUM'
        });
      }
    }
  });

  // 2. Transport Intelligence Rules
  const delayedFerries = Object.values(ferries).filter(f => f.status === 'DELAYED');
  if (delayedFerries.length > 0) {
    delayedFerries.forEach(f => {
      recommendations.push({
        id: `ferry-delay-${f.device_id}`,
        type: 'TRANSPORT',
        title: `Ferry Delayed: ${f.name}`,
        description: `The ferry ${f.name} operated by ${f.operator} is currently experiencing delays.`,
        priority: 'MEDIUM'
      });
    });
  }

  // 3. Safety Alerts
  const activeAlerts = alerts.filter(a => a.status === 'ACTIVE');
  activeAlerts.forEach(a => {
    recommendations.push({
      id: `alert-${a.id}`,
      type: 'SAFETY',
      title: a.title,
      description: a.message,
      priority: a.severity === 'CRITICAL' ? 'HIGH' : 'MEDIUM'
    });
  });

  // Sort by priority (HIGH first)
  return recommendations.sort((a, b) => {
    const pA = a.priority === 'HIGH' ? 2 : a.priority === 'MEDIUM' ? 1 : 0;
    const pB = b.priority === 'HIGH' ? 2 : b.priority === 'MEDIUM' ? 1 : 0;
    return pB - pA;
  });
};
