import { supabase } from '../lib/supabase';

export interface HealthCheckItem {
  name: string;
  status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';
  latencyMs: number;
  details?: string;
}

export interface SystemHealthReport {
  timestamp: string;
  overallStatus: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';
  environment: string;
  checks: HealthCheckItem[];
  uptimeSeconds: number;
}

const startTime = Date.now();

export const healthCheckService = {
  /**
   * Validates mandatory environment variables
   */
  checkEnvironmentVariables(): HealthCheckItem {
    const start = performance.now();
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || (typeof process !== 'undefined' ? process.env?.VITE_SUPABASE_URL : undefined);
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || (typeof process !== 'undefined' ? process.env?.VITE_SUPABASE_ANON_KEY : undefined);

    const missing: string[] = [];
    if (!supabaseUrl) missing.push('VITE_SUPABASE_URL');
    if (!supabaseAnonKey) missing.push('VITE_SUPABASE_ANON_KEY');

    const latencyMs = Math.round(performance.now() - start);

    if (missing.length > 0) {
      return {
        name: 'Environment Variables',
        status: 'UNHEALTHY',
        latencyMs,
        details: `Missing mandatory env vars: ${missing.join(', ')}`,
      };
    }

    return {
      name: 'Environment Variables',
      status: 'HEALTHY',
      latencyMs,
      details: 'All required environment variables configured.',
    };
  },

  /**
   * Checks Supabase database connectivity and read latency
   */
  async checkDatabaseConnectivity(): Promise<HealthCheckItem> {
    const start = performance.now();
    try {
      const { error } = await supabase.from('locations').select('id').limit(1);
      const latencyMs = Math.round(performance.now() - start);

      if (error) {
        return {
          name: 'Database (Supabase PostgreSQL)',
          status: 'DEGRADED',
          latencyMs,
          details: `Query returned error: ${error.message}`,
        };
      }

      return {
        name: 'Database (Supabase PostgreSQL)',
        status: 'HEALTHY',
        latencyMs,
        details: `Connected successfully (${latencyMs}ms)`,
      };
    } catch (err: any) {
      const latencyMs = Math.round(performance.now() - start);
      return {
        name: 'Database (Supabase PostgreSQL)',
        status: 'UNHEALTHY',
        latencyMs,
        details: `Connection failed: ${err?.message || 'Network error'}`,
      };
    }
  },

  /**
   * Checks Supabase Auth service status
   */
  async checkAuthService(): Promise<HealthCheckItem> {
    const start = performance.now();
    try {
      const { error } = await supabase.auth.getSession();
      const latencyMs = Math.round(performance.now() - start);

      if (error) {
        return {
          name: 'Authentication (Supabase Auth)',
          status: 'DEGRADED',
          latencyMs,
          details: `Session verification error: ${error.message}`,
        };
      }

      return {
        name: 'Authentication (Supabase Auth)',
        status: 'HEALTHY',
        latencyMs,
        details: 'Auth service operational.',
      };
    } catch (err: any) {
      const latencyMs = Math.round(performance.now() - start);
      return {
        name: 'Authentication (Supabase Auth)',
        status: 'UNHEALTHY',
        latencyMs,
        details: `Auth service unreachable: ${err?.message || 'Network error'}`,
      };
    }
  },

  /**
   * Checks client-side storage availability (LocalStorage / SessionStorage)
   */
  checkClientStorage(): HealthCheckItem {
    const start = performance.now();
    try {
      const testKey = '__nsl_health_test__';
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
      const latencyMs = Math.round(performance.now() - start);

      return {
        name: 'Browser LocalStorage',
        status: 'HEALTHY',
        latencyMs,
        details: 'LocalStorage read/write operational.',
      };
    } catch (err: any) {
      const latencyMs = Math.round(performance.now() - start);
      return {
        name: 'Browser LocalStorage',
        status: 'DEGRADED',
        latencyMs,
        details: 'LocalStorage restricted or unavailable.',
      };
    }
  },

  /**
   * Runs the complete diagnostic health check suite
   */
  async runFullSystemHealthCheck(): Promise<SystemHealthReport> {
    const [envCheck, dbCheck, authCheck, storageCheck] = await Promise.all([
      Promise.resolve(this.checkEnvironmentVariables()),
      this.checkDatabaseConnectivity(),
      this.checkAuthService(),
      Promise.resolve(this.checkClientStorage()),
    ]);

    const checks = [envCheck, dbCheck, authCheck, storageCheck];
    const hasUnhealthy = checks.some((c) => c.status === 'UNHEALTHY');
    const hasDegraded = checks.some((c) => c.status === 'DEGRADED');

    const overallStatus: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY' = hasUnhealthy
      ? 'UNHEALTHY'
      : hasDegraded
      ? 'DEGRADED'
      : 'HEALTHY';

    return {
      timestamp: new Date().toISOString(),
      overallStatus,
      environment: import.meta.env.MODE || 'production',
      checks,
      uptimeSeconds: Math.floor((Date.now() - startTime) / 1000),
    };
  },
};
