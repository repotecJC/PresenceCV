import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ViewerPage from '../src/pages/ViewerPage';
import * as useResume from '../src/hooks/useResume';

// Mock dependencies
vi.mock('../src/hooks/useResume', () => ({
  useResume: vi.fn()
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: vi.fn()
}));

vi.mock('../src/lib/firebase', () => ({
  auth: {},
  db: {}
}));

describe('ViewerPage Watermark Rendering', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const setupMock = (isPro: boolean) => {
    const defaultData = {
      isPro,
      profile: { name: 'John Doe', email: 'test@example.com' },
      contactItems: [],
      experience: [],
      education: [],
      skills: [],
      blockOrder: []
    };

    vi.mocked(useResume.useResume).mockReturnValue({
      data: defaultData,
      appState: { profiles: {}, activeProfileId: 'main' },
      activeTab: 'info',
      handleUpdate: vi.fn(),
      createNewProfile: vi.fn(),
      deleteProfile: vi.fn(),
      setActiveProfile: vi.fn(),
      addBlock: vi.fn(),
      removeBlock: vi.fn(),
      updateBlock: vi.fn(),
      reorderBlocks: vi.fn(),
      isSyncing: false
    } as any);
  };

  it('renders watermark for non-pro users in print mode', () => {
    setupMock(false);
    
    // Mock localStorage to bypass isSyncPrintWait
    const mockData = {
      isPro: false,
      profile: { name: 'John Doe', email: 'test@example.com' },
      contactItems: [],
      experience: [],
      education: [],
      skills: [],
      blockOrder: []
    };
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify(mockData));

    // Render with print=true search param
    render(
      <MemoryRouter initialEntries={['/view?print=true']}>
        <ViewerPage />
      </MemoryRouter>
    );

    const watermark = screen.getByText('Built with PresenceCV');
    expect(watermark).toBeInTheDocument();
  });

  it('hides watermark for pro users in print mode', () => {
    setupMock(true);

    const mockData = {
      isPro: true,
      profile: { name: 'John Doe', email: 'test@example.com' },
      contactItems: [],
      experience: [],
      education: [],
      skills: [],
      blockOrder: []
    };
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify(mockData));

    render(
      <MemoryRouter initialEntries={['/view?print=true']}>
        <ViewerPage />
      </MemoryRouter>
    );

    const watermark = screen.queryByText('Built with PresenceCV');
    expect(watermark).not.toBeInTheDocument();
  });

  it('renders profile summary with whitespace-pre-wrap in interactive mode', () => {
    const summaryText = 'First line\nSecond line\nThird line';
    const defaultData = {
      isPro: false,
      profile: { name: 'John Doe', summary: summaryText },
      contactItems: [],
      blocks: {},
      blockOrder: []
    };

    vi.mocked(useResume.useResume).mockReturnValue({
      data: defaultData,
      appState: { profiles: {}, activeProfileId: 'main' },
      activeTab: 'info',
      handleUpdate: vi.fn(),
      createNewProfile: vi.fn(),
      deleteProfile: vi.fn(),
      setActiveProfile: vi.fn(),
      addBlock: vi.fn(),
      removeBlock: vi.fn(),
      updateBlock: vi.fn(),
      reorderBlocks: vi.fn(),
      isSyncing: false
    } as any);

    render(
      <MemoryRouter initialEntries={['/view']}>
        <ViewerPage />
      </MemoryRouter>
    );

    const summaryEl = screen.getByText((content) => content.includes('First line'));
    expect(summaryEl.className).toContain('whitespace-pre-wrap');
  });

  it('renders profile summary with whitespace-pre-wrap in print mode', () => {
    const summaryText = 'First line\nSecond line';
    const mockData = {
      isPro: true,
      profile: { name: 'John Doe', summary: summaryText },
      contactItems: [],
      blocks: {},
      blockOrder: []
    };
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify(mockData));

    vi.mocked(useResume.useResume).mockReturnValue({
      data: mockData,
      appState: { profiles: {}, activeProfileId: 'main' },
      activeTab: 'info',
      handleUpdate: vi.fn(),
      createNewProfile: vi.fn(),
      deleteProfile: vi.fn(),
      setActiveProfile: vi.fn(),
      addBlock: vi.fn(),
      removeBlock: vi.fn(),
      updateBlock: vi.fn(),
      reorderBlocks: vi.fn(),
      isSyncing: false
    } as any);

    render(
      <MemoryRouter initialEntries={['/view?print=true']}>
        <ViewerPage />
      </MemoryRouter>
    );

    const summaryEl = screen.getByText((content) => content.includes('First line'));
    expect(summaryEl.className).toContain('whitespace-pre-wrap');
  });
});

