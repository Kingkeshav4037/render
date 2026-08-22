import { supabase } from '../../lib/supabase';
import { useRealtimeStore } from '../../store/useRealtimeStore';
import { toast } from 'sonner';

class RealtimeClient {
  private channel: any;
  private initialized = false;

  async initialize() {
    if (this.initialized) return;
    this.initialized = true;

    // Clean up any stale channel instances (e.g. from React Strict Mode hot reloads)
    const existingChannel = supabase.getChannels().find(c => c.topic === 'realtime:iot-system');
    if (existingChannel) {
      supabase.removeChannel(existingChannel);
    }

    useRealtimeStore.getState().setConnectionStatus('connecting');

    // Initial Fetch
    await this.fetchInitialState();

    // Subscribe to all IoT tables using a unique channel name to prevent Strict Mode collisions
    const channelName = `iot-system-${Math.random().toString(36).substring(7)}`;
    this.channel = supabase.channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'ev_chargers' },
        (payload) => {
          if (payload.new) useRealtimeStore.getState().updateEVCharger(payload.new);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'ferries' },
        (payload) => {
          if (payload.new) useRealtimeStore.getState().updateFerry(payload.new);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'infrastructure_assets' },
        (payload) => {
          if (payload.new) useRealtimeStore.getState().updateInfrastructure(payload.new);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'weather_snapshots' },
        (payload) => {
          if (payload.new) useRealtimeStore.getState().updateWeather(payload.new);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'aurora_forecasts' },
        (payload) => {
          if (payload.new) useRealtimeStore.getState().updateAurora(payload.new);
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'smart_alerts' },
        (payload) => {
          const alert = payload.new;
          useRealtimeStore.getState().addAlert(alert);
          if (alert.severity === 'CRITICAL' || alert.severity === 'WARNING') {
            toast.error(`${alert.title}: ${alert.message}`);
          } else {
            toast.info(`${alert.title}: ${alert.message}`);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'iot_telemetry' },
        (payload) => {
          useRealtimeStore.getState().addTelemetry(payload.new);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          useRealtimeStore.getState().setConnectionStatus('connected');
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          useRealtimeStore.getState().setConnectionStatus('disconnected');
        }
      });
  }

  async fetchInitialState() {
    try {
      const [evRes, ferriesRes, infraRes] = await Promise.all([
        supabase.from('ev_chargers').select('*'),
        supabase.from('ferries').select('*'),
        supabase.from('infrastructure_assets').select('*')
      ]);

      if (evRes.data) useRealtimeStore.getState().setInitialEVChargers(evRes.data);
      if (ferriesRes.data) useRealtimeStore.getState().setInitialFerries(ferriesRes.data);
      if (infraRes.data) useRealtimeStore.getState().setInitialInfrastructure(infraRes.data);
    } catch (err) {
      console.error('Failed to fetch initial IoT state', err);
    }
  }

  disconnect() {
    if (this.channel) {
      supabase.removeChannel(this.channel);
      this.channel = null;
    }
    this.initialized = false;
    useRealtimeStore.getState().setConnectionStatus('disconnected');
  }
}

export const realtimeClient = new RealtimeClient();
