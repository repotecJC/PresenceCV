import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, act } from '@testing-library/react';
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

  it('does not render a javascript: tag-block URL as a clickable href in print mode', () => {
    const mockData = {
      isPro: true,
      profile: { name: 'John Doe' },
      contactItems: [],
      blocks: {
        skills: {
          id: 'skills',
          title: 'Skills',
          type: 'tags',
          items: [
            { id: '1', text: 'Malicious: XSS', url: 'javascript:alert(document.domain)' },
            { id: '2', text: 'Portfolio: React', url: 'https://example.com/portfolio' }
          ]
        }
      },
      blockOrder: ['skills']
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

    const { container } = render(
      <MemoryRouter initialEntries={['/view?print=true']}>
        <ViewerPage />
      </MemoryRouter>
    );

    const maliciousLink = screen.getByText('Malicious').closest('a');
    expect(maliciousLink).not.toBeNull();
    expect(maliciousLink?.getAttribute('href')).toBe('#');

    // No anchor anywhere in the print layout may carry a script-capable href.
    const hrefs = Array.from(container.querySelectorAll('a')).map(a => a.getAttribute('href') ?? '');
    expect(hrefs.some(href => href.toLowerCase().replace(/\s/g, '').startsWith('javascript:'))).toBe(false);

    // Legitimate URLs are still linked.
    expect(screen.getByText('Portfolio').closest('a')?.getAttribute('href')).toBe('https://example.com/portfolio');
  });

  describe('print-mode postMessage origin check', () => {
    const setupPrintMock = () => {
      // No localStorage payload: the print view must wait for a postMessage sync.
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

      vi.mocked(useResume.useResume).mockReturnValue({
        data: { isPro: true, profile: { name: 'Real User' }, contactItems: [], blocks: {}, blockOrder: [] },
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

    const dispatchSync = (origin: string, name: string) => {
      const event = new MessageEvent('message', {
        data: { type: 'RESUME_DATA_SYNC', data: { isPro: true, profile: { name }, contactItems: [], blocks: {}, blockOrder: [] } }
      });
      Object.defineProperty(event, 'origin', { value: origin });
      act(() => { window.dispatchEvent(event); });
    };

    it('ignores RESUME_DATA_SYNC from a foreign origin', () => {
      setupPrintMock();

      render(
        <MemoryRouter initialEntries={['/view?print=true']}>
          <ViewerPage />
        </MemoryRouter>
      );

      dispatchSync('https://evil.example', 'Injected By Attacker');

      expect(screen.queryByText('Injected By Attacker')).not.toBeInTheDocument();
    });

    it('accepts RESUME_DATA_SYNC from the same origin', () => {
      setupPrintMock();

      render(
        <MemoryRouter initialEntries={['/view?print=true']}>
          <ViewerPage />
        </MemoryRouter>
      );

      dispatchSync(window.location.origin, 'Synced User');

      expect(screen.getByText('Synced User')).toBeInTheDocument();
    });
  });

  it('renders list block description with proper prose spacing classes in list view', () => {
    const mockData = {
      isPro: false,
      profile: { name: 'John Doe' },
      contactItems: [],
      blocks: {
        experience: {
          id: 'experience',
          title: 'Experience',
          type: 'list',
          items: [
            { id: '1', title: 'Developer', subtitle: 'Company', period: '2023', description: '<p>Line 1</p><p>Line 2</p>' }
          ]
        }
      },
      blockOrder: ['experience']
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

    const descEl = screen.getByText('Line 1').closest('.prose');
    expect(descEl).not.toBeNull();
    expect(descEl?.className).toContain('prose-p:my-1');
  });
});



