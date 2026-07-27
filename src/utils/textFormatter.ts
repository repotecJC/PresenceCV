export type FormatType = 'bold' | 'italic' | 'bulletList' | 'numberList';

export interface FormatResult {
  text: string;
  selectionStart: number;
  selectionEnd: number;
}

export function applyFormatting(
  text: string,
  selectionStart: number,
  selectionEnd: number,
  format: FormatType
): FormatResult {
  const start = Math.min(selectionStart, selectionEnd);
  const end = Math.max(selectionStart, selectionEnd);
  const selectedText = text.slice(start, end);

  if (format === 'bold') {
    if (selectedText.startsWith('**') && selectedText.endsWith('**') && selectedText.length >= 4) {
      const unbolded = selectedText.slice(2, -2);
      const newText = text.slice(0, start) + unbolded + text.slice(end);
      return { text: newText, selectionStart: start, selectionEnd: start + unbolded.length };
    }
    const bolded = `**${selectedText}**`;
    const newText = text.slice(0, start) + bolded + text.slice(end);
    return { text: newText, selectionStart: start, selectionEnd: start + bolded.length };
  }

  if (format === 'italic') {
    if (selectedText.startsWith('*') && selectedText.endsWith('*') && selectedText.length >= 2 && !selectedText.startsWith('**')) {
      const unitalicized = selectedText.slice(1, -1);
      const newText = text.slice(0, start) + unitalicized + text.slice(end);
      return { text: newText, selectionStart: start, selectionEnd: start + unitalicized.length };
    }
    const italicized = `*${selectedText}*`;
    const newText = text.slice(0, start) + italicized + text.slice(end);
    return { text: newText, selectionStart: start, selectionEnd: start + italicized.length };
  }

  if (format === 'bulletList') {
    const lines = (selectedText || text).split('\n');
    const allHaveBullets = lines.every(line => line.trim().startsWith('• ') || line.trim().startsWith('- '));
    const newLines = lines.map(line => {
      if (allHaveBullets) {
        return line.replace(/^(\s*)([•-]\s*)/, '$1');
      }
      return line.startsWith('• ') ? line : `• ${line}`;
    });
    const formatted = newLines.join('\n');
    if (selectedText) {
      const newText = text.slice(0, start) + formatted + text.slice(end);
      return { text: newText, selectionStart: start, selectionEnd: start + formatted.length };
    }
    return { text: formatted, selectionStart: 0, selectionEnd: formatted.length };
  }

  if (format === 'numberList') {
    const lines = (selectedText || text).split('\n');
    const allHaveNumbers = lines.every(line => /^\s*\d+\.\s*/.test(line));
    const newLines = lines.map((line, idx) => {
      if (allHaveNumbers) {
        return line.replace(/^\s*\d+\.\s*/, '');
      }
      return line.match(/^\d+\.\s*/) ? line : `${idx + 1}. ${line}`;
    });
    const formatted = newLines.join('\n');
    if (selectedText) {
      const newText = text.slice(0, start) + formatted + text.slice(end);
      return { text: newText, selectionStart: start, selectionEnd: start + formatted.length };
    }
    return { text: formatted, selectionStart: 0, selectionEnd: formatted.length };
  }

  return { text, selectionStart, selectionEnd };
}
