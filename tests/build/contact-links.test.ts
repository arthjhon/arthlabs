import { describe, it, expect } from 'vitest';
import { loadPage } from './helpers';

describe('/contact', () => {
  const doc = loadPage('/contact');

  it('keeps the form contract with the worker', () => {
    const form = doc.querySelector('form#contact-form')!;
    expect(form.getAttribute('action')).toBe('/api/contact');
    expect(form.getAttribute('method')).toBe('POST');
    for (const name of ['name', 'email', 'message', 'company']) {
      expect(form.querySelector(`[name="${name}"]`), name).not.toBeNull();
    }
    expect(form.querySelector('[name="message"]')!.getAttribute('maxlength')).toBe('5000');
  });

  it('every visible field has a real label', () => {
    for (const id of ['name', 'email', 'message']) {
      expect(doc.querySelector(`label[for="${id}"]`)!.text.trim()).not.toMatch(/^\/\//);
    }
  });

  it('status region is announced', () => {
    expect(doc.querySelector('#form-status')!.getAttribute('aria-live')).toBe('polite');
  });
});

describe('/links', () => {
  const doc = loadPage('/links');
  it('lists every link without gradient frame or prompt', () => {
    expect(doc.querySelectorAll('a.link-item').length).toBe(7);
    expect(doc.text).not.toContain('$ whoami');
  });
});
