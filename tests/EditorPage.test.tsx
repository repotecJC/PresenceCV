import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EditorPage from '../src/pages/EditorPage';
import { MemoryRouter } from 'react-router-dom';
import * as AuthContext from '../src/contexts/AuthContext';
import * as useResume from '../src/hooks/useResume';


// Mock dependencies
vi.mock('../src/hooks/useResume', () => ({
  useResume: vi.fn()
}));

vi.mock('../src/contexts/AuthContext', () => ({
  useAuth: vi.fn()
}));

const mockAlert = vi.spyOn(window, 'alert').mockImplementation(() => {});

describe('Editor UI limits', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const setupMock = (isPro: boolean, isAdmin: boolean, profileCount: number) => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: { uid: '123' } as any,
      isPro,
      isAdmin,
      loading: false,
      isNewUser: false,
      signInWithGoogle: vi.fn(),
      signOut: vi.fn()
    });

    const profiles = {};
    for (let i = 0; i < profileCount; i++) {
      profiles[`id_${i}`] = { id: `id_${i}`, name: `Profile ${i}` };
    }

    vi.mocked(useResume.useResume).mockReturnValue({
      appState: { profiles, activeProfileId: 'id_0' },
      data: { blocks: {}, blockOrder: [], profile: {} },
      activeTab: 'profile',
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

  it('denies opening import modal if !isPro and !isAdmin and count >= 3', () => {
    setupMock(false, false, 3);

    render(
      <MemoryRouter>
        <EditorPage />
      </MemoryRouter>
    );

    const uploadButton = screen.getByText(/Upload Resume/i);
    fireEvent.click(uploadButton);

    expect(mockAlert).toHaveBeenCalledWith('You have reached the maximum number of 3 resumes for non-pro users. Please upgrade to Pro or delete an existing resume to import a new one.');
  });

  it('allows opening import modal if isPro and count >= 3', () => {
    setupMock(true, false, 3);

    render(
      <MemoryRouter>
        <EditorPage />
      </MemoryRouter>
    );

    const uploadButton = screen.getByText(/Upload Resume/i);
    fireEvent.click(uploadButton);

    expect(mockAlert).not.toHaveBeenCalled();
    // In EditorPage, the modal open state is internal. We can just verify no alert.
  });

  it('allows opening import modal if isAdmin and count >= 3', () => {
    setupMock(false, true, 3);

    render(
      <MemoryRouter>
        <EditorPage />
      </MemoryRouter>
    );

    const uploadButton = screen.getByText(/Upload Resume/i);
    fireEvent.click(uploadButton);

    expect(mockAlert).not.toHaveBeenCalled();
  });
});
