import { describe, it, expect } from 'vitest';
import { applyFormatting } from '../src/utils/textFormatter';

describe('textFormatter utility', () => {
  it('applies bold formatting to selected text', () => {
    const input = 'Hello World';
    // Select 'World' (start: 6, end: 11)
    const result = applyFormatting(input, 6, 11, 'bold');
    expect(result.text).toBe('Hello **World**');
    expect(result.selectionStart).toBe(6);
    expect(result.selectionEnd).toBe(15);
  });

  it('toggles bold formatting off if selection is already bold', () => {
    const input = 'Hello **World**';
    const result = applyFormatting(input, 6, 15, 'bold');
    expect(result.text).toBe('Hello World');
  });

  it('applies italic formatting to selected text', () => {
    const input = 'Hello World';
    const result = applyFormatting(input, 6, 11, 'italic');
    expect(result.text).toBe('Hello *World*');
    expect(result.selectionStart).toBe(6);
    expect(result.selectionEnd).toBe(13);
  });

  it('toggles italic formatting off if selection is already italic', () => {
    const input = 'Hello *World*';
    const result = applyFormatting(input, 6, 13, 'italic');
    expect(result.text).toBe('Hello World');
  });

  it('applies bullet list formatting to multi-line text', () => {
    const input = 'First item\nSecond item';
    const result = applyFormatting(input, 0, input.length, 'bulletList');
    expect(result.text).toBe('• First item\n• Second item');
  });

  it('toggles bullet list formatting off if lines already have bullets', () => {
    const input = '• First item\n• Second item';
    const result = applyFormatting(input, 0, input.length, 'bulletList');
    expect(result.text).toBe('First item\nSecond item');
  });

  it('applies numbered list formatting to multi-line text', () => {
    const input = 'First item\nSecond item';
    const result = applyFormatting(input, 0, input.length, 'numberList');
    expect(result.text).toBe('1. First item\n2. Second item');
  });

  it('toggles numbered list formatting off if lines already have numbers', () => {
    const input = '1. First item\n2. Second item';
    const result = applyFormatting(input, 0, input.length, 'numberList');
    expect(result.text).toBe('First item\nSecond item');
  });
});
