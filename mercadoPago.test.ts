/**
 * Testes de validação das credenciais do Mercado Pago
 */

import { describe, it, expect } from 'vitest';

describe('Mercado Pago Credentials', () => {
  it('should have MERCADO_PAGO_ACCESS_TOKEN configured', () => {
    const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    expect(token).toBeDefined();
    expect(token).not.toBe('');
    expect(token?.startsWith('APP_USR-')).toBe(true);
  });

  it('should have MERCADO_PAGO_PUBLIC_KEY configured', () => {
    const publicKey = process.env.MERCADO_PAGO_PUBLIC_KEY;
    expect(publicKey).toBeDefined();
    expect(publicKey).not.toBe('');
    expect(publicKey?.startsWith('APP_USR-')).toBe(true);
  });

  it('should be able to initialize MercadoPago client', async () => {
    const { MercadoPagoConfig } = await import('mercadopago');
    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    
    expect(() => {
      new MercadoPagoConfig({ accessToken: accessToken! });
    }).not.toThrow();
  });
});
