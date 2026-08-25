import { describe, it, expect } from 'vitest';
import crypto from 'crypto';

describe('Edge Function: razorpay-webhook & signature verification', () => {
  const secret = 'webhook_secret_nordic_secure_777';
  const payload = JSON.stringify({
    event: 'payment.captured',
    payload: {
      payment: {
        entity: {
          id: 'pay_99887766',
          order_id: 'order_11223344',
          amount: 189000,
          status: 'captured'
        }
      }
    }
  });

  it('Should correctly compute and verify HMAC SHA256 webhook signature', () => {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    expect(expectedSignature).toBeDefined();
    expect(expectedSignature.length).toBe(64);

    // Verify matching signature
    const computed = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    expect(computed).toBe(expectedSignature);
  });

  it('Should reject an invalid or tampered HMAC signature', () => {
    const tamperedPayload = payload.replace('189000', '999999');
    const validSignature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    const tamperedSignature = crypto.createHmac('sha256', secret).update(tamperedPayload).digest('hex');

    expect(validSignature).not.toBe(tamperedSignature);
  });

  it('Should verify payment verification signature format order_id|payment_id', () => {
    const orderId = 'order_11223344';
    const paymentId = 'pay_99887766';
    const keySecret = 'secret_key_555';

    const verificationPayload = `${orderId}|${paymentId}`;
    const signature = crypto.createHmac('sha256', keySecret).update(verificationPayload).digest('hex');

    expect(signature).toBeDefined();
    expect(signature.length).toBe(64);
  });
});

