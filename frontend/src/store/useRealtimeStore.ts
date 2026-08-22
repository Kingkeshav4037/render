import { create } from 'zustand';

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'failed';

interface RealtimeState {
  evChargers: Record<string, any>;
  ferries: Record<string, any>;
  infrastructure: Record<string, any>;
  alerts: any[];
  telemetry: Record<string, any[]>; // device_id -> array of recent telemetry
  weather: Record<string, any>; // location_id -> weather snapshot
  aurora: Record<string, any>; // location_id -> aurora forecast
  connectionStatus: ConnectionStatus;

  // Actions
  setConnectionStatus: (status: ConnectionStatus) => void;
  updateEVCharger: (charger: any) => void;
  updateFerry: (ferry: any) => void;
  updateInfrastructure: (asset: any) => void;
  updateWeather: (weather: any) => void;
  updateAurora: (aurora: any) => void;
  addAlert: (alert: any) => void;
  addTelemetry: (data: any) => void;
  
  // Batch initialization
  setInitialEVChargers: (chargers: any[]) => void;
  setInitialFerries: (ferries: any[]) => void;
  setInitialInfrastructure: (assets: any[]) => void;
}

export const useRealtimeStore = create<RealtimeState>((set) => ({
  evChargers: {},
  ferries: {},
  infrastructure: {},
  alerts: [],
  telemetry: {},
  weather: {},
  aurora: {},
  connectionStatus: 'disconnected',

  setConnectionStatus: (status) => set({ connectionStatus: status }),
  
  updateEVCharger: (charger) => set((state) => ({
    evChargers: { ...state.evChargers, [charger.device_id]: { ...state.evChargers[charger.device_id], ...charger } }
  })),

  updateFerry: (ferry) => set((state) => ({
    ferries: { ...state.ferries, [ferry.device_id]: { ...state.ferries[ferry.device_id], ...ferry } }
  })),

  updateInfrastructure: (asset) => set((state) => ({
    infrastructure: { ...state.infrastructure, [asset.id]: { ...state.infrastructure[asset.id], ...asset } }
  })),

  updateWeather: (weather) => set((state) => ({
    weather: { ...state.weather, [weather.location_id]: weather }
  })),

  updateAurora: (aurora) => set((state) => ({
    aurora: { ...state.aurora, [aurora.location_id]: aurora }
  })),

  addAlert: (alert) => set((state) => ({
    alerts: [alert, ...state.alerts].slice(0, 50) // keep last 50
  })),

  addTelemetry: (data) => set((state) => {
    const existing = state.telemetry[data.device_id] || [];
    return {
      telemetry: {
        ...state.telemetry,
        [data.device_id]: [data, ...existing].slice(0, 100) // keep last 100 per device
      }
    };
  }),

  setInitialEVChargers: (chargers) => set(() => {
    const map: Record<string, any> = {};
    chargers.forEach(c => map[c.device_id] = c);
    return { evChargers: map };
  }),

  setInitialFerries: (ferries) => set(() => {
    const map: Record<string, any> = {};
    ferries.forEach(f => map[f.device_id] = f);
    return { ferries: map };
  }),

  setInitialInfrastructure: (assets) => set(() => {
    const map: Record<string, any> = {};
    assets.forEach(a => map[a.id] = a);
    return { infrastructure: map };
  })
}));
