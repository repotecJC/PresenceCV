import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LanguageSwitcher from '../src/components/LanguageSwitcher';

const mockChangeLanguage = vi.fn();

vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => key,
      i18n: {
        changeLanguage: mockChangeLanguage,
        language: 'en'
      }
    })
  };
});

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly and triggers language change', () => {
    render(<LanguageSwitcher />);
    
    const button = screen.getByRole('button', { name: /Toggle Language/i });
    expect(button).toBeInTheDocument();
    
    fireEvent.click(button);
    expect(mockChangeLanguage).toHaveBeenCalledWith('zh-TW');
  });
});
