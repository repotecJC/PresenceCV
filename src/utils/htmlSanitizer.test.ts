import { describe, it, expect } from 'vitest';
import { isSafeUrl } from './htmlSanitizer';

describe('isSafeUrl', () => {
  it('should allow valid http/https URLs', () => {
    expect(isSafeUrl('http://example.com')).toBe(true);
    expect(isSafeUrl('https://example.com')).toBe(true);
  });
  
  it('should allow mailto and tel protocols', () => {
    expect(isSafeUrl('mailto:test@example.com')).toBe(true);
    expect(isSafeUrl('tel:+123456789')).toBe(true);
  });

  it('should allow relative URLs and anchors', () => {
    expect(isSafeUrl('/view')).toBe(true);
    expect(isSafeUrl('#section')).toBe(true);
  });

  it('should block javascript: URLs', () => {
    expect(isSafeUrl('javascript:alert(1)')).toBe(false);
    expect(isSafeUrl('javascript:void(0)')).toBe(false);
  });

  it('should return false for empty or undefined', () => {
    expect(isSafeUrl('')).toBe(false);
    expect(isSafeUrl(undefined)).toBe(false);
  });
});
