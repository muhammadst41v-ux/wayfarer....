import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface EditModeContextType {
  isEditMode: boolean;
  toggleEditMode: () => void;
  setEditMode: (enabled: boolean) => void;
  overrides: Record<string, string>;
  updateText: (key: string, value: string) => void;
  resetAll: () => void;
  exportJson: () => void;
  importJson: (jsonString: string) => boolean;
  getText: (key: string, fallback: string) => string;
}

const STORAGE_KEY = 'wayfarer_live_edits_v1';
const EditModeContext = createContext<EditModeContextType | null>(null);

export const EditModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isEditMode, setIsEditMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('edit') === '1';
  });

  const [overrides, setOverrides] = useState<Record<string, string>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Listen for Ctrl+E keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'e') {
        // Prevent default browser search/action
        e.preventDefault();
        setIsEditMode((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const updateText = useCallback((key: string, value: string) => {
    setOverrides((prev) => {
      const updated = { ...prev, [key]: value };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save edit to localStorage', err);
      }
      return updated;
    });
  }, []);

  const resetAll = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setOverrides({});
    } catch (err) {
      console.error('Failed to clear overrides', err);
    }
  }, []);

  const exportJson = useCallback(() => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(overrides, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'wayfarer-content-edits.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [overrides]);

  const importJson = useCallback((jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (typeof parsed === 'object' && parsed !== null) {
        setOverrides(parsed);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const getText = useCallback(
    (key: string, fallback: string): string => {
      if (overrides[key] !== undefined) {
        return overrides[key];
      }
      return fallback;
    },
    [overrides]
  );

  return (
    <EditModeContext.Provider
      value={{
        isEditMode,
        toggleEditMode: () => setIsEditMode((prev) => !prev),
        setEditMode: setIsEditMode,
        overrides,
        updateText,
        resetAll,
        exportJson,
        importJson,
        getText,
      }}
    >
      {children}
    </EditModeContext.Provider>
  );
};

export function useEditMode() {
  const context = useContext(EditModeContext);
  if (!context) {
    throw new Error('useEditMode must be used within an EditModeProvider');
  }
  return context;
}
