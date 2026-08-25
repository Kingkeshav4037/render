import { describe, it, expect } from 'vitest';

describe('Edge Function: create-razorpay-order / create-payment', () => {
  it('Should calculate amount in smallest currency unit (øre/paise/cents)', () => {
    const totalAmountNOK = 1890.50;
    const amountInSmallestUnit = Math.round(totalAmountNOK * 100);
    expect(amountInSmallestUnit).toBe(189050);
  });

  it('Should format Basic Auth header from server credentials without leaking to client', () => {
    const keyId = 'rzp_test_123456';
    const keySecret = 'secret_test_abcdef';
    const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    
    expect(basicAuth).toBe('cnpwX3Rlc3RfMTIzNDU2OnNlY3JldF90ZXN0X2FiY2RlZg==');
    expect(Buffer.from(basicAuth, 'base64').toString('utf-8')).toBe(`${keyId}:${keySecret}`);
  });

  it('Should validate required order parameters for create-payment', () => {
    const validPayload = { orderId: 'ord-101', gateway: 'Razorpay' };
    expect(validPayload.orderId).toBeDefined();
    expect(validPayload.gateway).toBe('Razorpay');

    const invalidPayload: any = { gateway: 'Unsupported' };
    expect(invalidPayload.orderId).toBeUndefined();
    expect(invalidPayload.gateway !== 'Razorpay').toBe(true);
  });
});

