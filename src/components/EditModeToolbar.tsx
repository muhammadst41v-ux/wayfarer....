import React, { useState } from 'react';
import { useEditMode } from '../context/EditModeContext';
import { useTheme } from '../context/ThemeContext';
import { SiteCategory, ThemePreset } from '../types';
import { Download, Upload, RotateCcw, X, Edit3, Layers, Palette } from 'lucide-react';

export const EditModeToolbar: React.FC = () => {
  const { isEditMode, toggleEditMode, overrides, resetAll, exportJson, importJson } = useEditMode();
  const { activeCategory, setCategory, activeTheme, setTheme } = useTheme();
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');

  const editCount = Object.keys(overrides).length;

  const handleImportSubmit = () => {
    setImportError('');
    const success = importJson(importText);
    if (success) {
      setShowImportModal(false);
      setImportText('');
    } else {
      setImportError('Invalid JSON format. Please paste valid JSON key-value pairs.');
    }
  };

  if (!isEditMode) {
    return (
      <button
        onClick={toggleEditMode}
        title="Toggle Edit Mode (Ctrl+E)"
        className="fixed bottom-4 right-4 z-40 flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-[#11141a]/80 backdrop-blur-md text-amber-400 border border-amber-500/30 rounded-lg hover:border-amber-400 shadow-xl transition-all hover:scale-105"
      >
        <Edit3 className="w-3.5 h-3.5 text-amber-400" />
        <span className="hidden sm:inline">Edit Mode</span>
        <kbd className="px-1 text-[10px] bg-white/10 rounded">Ctrl+E</kbd>
      </button>
    );
  }

  return (
    <>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-wrap items-center gap-2 px-4 py-2 bg-[#0d1017]/95 border border-amber-500/50 rounded-xl shadow-2xl backdrop-blur-lg text-xs font-sans text-neutral-200">
        <div className="flex items-center gap-1.5 pr-2 border-r border-white/10 font-medium text-amber-400">
          <Edit3 className="w-3.5 h-3.5" />
          <span>Live Editor</span>
          {editCount > 0 && (
            <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 font-mono text-[10px] rounded">
              {editCount} changed
            </span>
          )}
        </div>

        {/* Category Switcher */}
        <div className="flex items-center gap-1 px-1">
          <Layers className="w-3 h-3 text-neutral-400" />
          <span className="text-[11px] text-neutral-400">Pack:</span>
          {(['travel', 'fitness', 'food'] as SiteCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-2 py-0.5 rounded capitalize transition-colors ${
                activeCategory === cat
                  ? 'bg-amber-500 text-black font-semibold'
                  : 'bg-white/5 hover:bg-white/10 text-neutral-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Theme Switcher */}
        <div className="flex items-center gap-1 px-1 border-l border-white/10">
          <Palette className="w-3 h-3 text-neutral-400" />
          <span className="text-[11px] text-neutral-400">Theme:</span>
          {(['cinematic-amber', 'clean-light', 'bold-neon'] as ThemePreset[]).map((thm) => (
            <button
              key={thm}
              onClick={() => setTheme(thm)}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                activeTheme === thm
                  ? 'bg-amber-500 text-black font-semibold'
                  : 'bg-white/5 hover:bg-white/10 text-neutral-300'
              }`}
            >
              {thm === 'cinematic-amber' ? 'Amber' : thm === 'clean-light' ? 'Light' : 'Neon'}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 pl-2 border-l border-white/10">
          <button
            onClick={exportJson}
            title="Export all edits as JSON"
            className="flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded text-neutral-200 transition-colors"
          >
            <Download className="w-3 h-3" />
            <span>Export</span>
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            title="Import custom edits JSON"
            className="flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded text-neutral-200 transition-colors"
          >
            <Upload className="w-3 h-3" />
            <span>Import</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Reset all live edits back to default site.config.ts?')) {
                resetAll();
              }
            }}
            title="Reset edits to defaults"
            className="flex items-center gap-1 px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>

          <button
            onClick={toggleEditMode}
            title="Exit edit mode (Ctrl+E)"
            className="p-1 hover:bg-white/10 rounded text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md p-5 bg-[#141820] border border-white/15 rounded-xl shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">Import Content JSON</h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-neutral-400 mb-3">
              Paste exported JSON key-value content to overwrite current in-memory edits.
            </p>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder='{ "hero.title": "My Custom Title" }'
              rows={6}
              className="w-full p-2.5 font-mono text-xs bg-black/50 border border-white/15 rounded-lg text-neutral-200 outline-none focus:border-amber-400"
            />
            {importError && <p className="mt-2 text-xs text-rose-400">{importError}</p>}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-3 py-1.5 text-xs text-neutral-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleImportSubmit}
                className="px-4 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-black rounded-lg transition-colors"
              >
                Apply JSON
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
