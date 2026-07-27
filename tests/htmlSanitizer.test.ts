import { describe, it, expect } from 'vitest';
import { sanitizeHtml, migrateLegacyTextToHtml } from '../src/utils/htmlSanitizer';

describe('htmlSanitizer', () => {
  describe('sanitizeHtml', () => {
    it('removes unsafe tags like <script>', () => {
      const unsafe = '<script>alert("xss")</script><p>Hello</p>';
      const safe = sanitizeHtml(unsafe);
      expect(safe).not.toContain('<script>');
      expect(safe).toContain('<p>Hello</p>');
    });

    it('keeps safe tags like <b>, <strong>, <em>, <ul>, <ol>, <li>', () => {
      const input = '<ul><li><strong>Bold</strong> and <em>Italic</em></li></ul>';
      const safe = sanitizeHtml(input);
      expect(safe).toBe(input);
    });

    it('removes javascript: protocols from links', () => {
      const input = '<a href="javascript:alert(1)">Click</a>';
      const safe = sanitizeHtml(input);
      expect(safe).not.toContain('href="javascript');
      expect(safe).toContain('<a>Click</a>');
    });
  });

  describe('migrateLegacyTextToHtml', () => {
    it('returns empty string if input is empty', () => {
      expect(migrateLegacyTextToHtml('')).toBe('');
      expect(migrateLegacyTextToHtml(undefined as any)).toBe('');
    });

    it('returns the same string if it already contains HTML tags like <p>', () => {
      const input = '<p>Already HTML</p>';
      expect(migrateLegacyTextToHtml(input)).toBe(input);
    });

    it('converts plain text with line breaks to paragraphs', () => {
      const input = 'Line 1\nLine 2';
      const html = migrateLegacyTextToHtml(input);
      expect(html).toContain('<p>Line 1</p>');
      expect(html).toContain('<p>Line 2</p>');
    });

    it('converts lines starting with • to an unordered list', () => {
      const input = '• Item 1\n• Item 2';
      const html = migrateLegacyTextToHtml(input);
      expect(html).toContain('<ul>');
      expect(html).toContain('<li>Item 1</li>');
      expect(html).toContain('<li>Item 2</li>');
      expect(html).toContain('</ul>');
    });
    
    it('converts markdown **bold** and *italic* to <strong> and <em>', () => {
      const input = 'This is **bold** and this is *italic*';
      const html = migrateLegacyTextToHtml(input);
      expect(html).toContain('<strong>bold</strong>');
      expect(html).toContain('<em>italic</em>');
    });
  });
});
