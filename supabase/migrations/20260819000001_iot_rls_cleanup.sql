-- Drop permissive public read policies
DROP POLICY IF EXISTS "Public read iot_devices" ON public.iot_devices;
DROP POLICY IF EXISTS "Public read iot_telemetry" ON public.iot_telemetry;
DROP POLICY IF EXISTS "Public read smart_alerts" ON public.smart_alerts;

-- 1. iot_devices Policies

-- Admin can manage all iot_devices
CREATE POLICY "Admins can manage all iot_devices" ON public.iot_devices
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = ANY(ARRAY['ADMIN'::public.user_role, 'SUPER_ADMIN'::public.user_role])
        )
    );

-- 2. iot_telemetry Policies

-- Admin can manage all iot_telemetry
CREATE POLICY "Admins can manage all iot_telemetry" ON public.iot_telemetry
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = ANY(ARRAY['ADMIN'::public.user_role, 'SUPER_ADMIN'::public.user_role])
        )
    );

-- Provider can read their own telemetry
CREATE POLICY "Providers can read own telemetry" ON public.iot_telemetry
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.iot_devices
            WHERE iot_devices.device_id = iot_telemetry.device_id
              AND iot_devices.provider_id = auth.uid()
        )
    );

-- 3. smart_alerts Policies

-- Admin can manage all smart_alerts
CREATE POLICY "Admins can manage all smart_alerts" ON public.smart_alerts
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = ANY(ARRAY['ADMIN'::public.user_role, 'SUPER_ADMIN'::public.user_role])
        )
    );

-- Provider can manage own smart_alerts (based on device ownership)
CREATE POLICY "Providers can manage own smart_alerts" ON public.smart_alerts
    USING (
        EXISTS (
            SELECT 1 FROM public.iot_devices
            WHERE iot_devices.device_id = smart_alerts.device_id
              AND iot_devices.provider_id = auth.uid()
        )
    );
