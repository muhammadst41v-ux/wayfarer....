import React, { useState, useRef, useEffect } from 'react';
import { useEditMode } from '../context/EditModeContext';
import { Pencil } from 'lucide-react';

interface EditableTextProps {
  contentKey: string;
  defaultText: string;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'div';
  className?: string;
  multiline?: boolean;
}

export const EditableText: React.FC<EditableTextProps> = ({
  contentKey,
  defaultText,
  as: Component = 'span',
  className = '',
  multiline = false,
}) => {
  const { isEditMode, getText, updateText } = useEditMode();
  const currentText = getText(contentKey, defaultText);

  const [isEditing, setIsEditing] = useState(false);
  const [val, setVal] = useState(currentText);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setVal(currentText);
  }, [currentText]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    setIsEditing(false);
    if (val !== currentText) {
      updateText(contentKey, val);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      setVal(currentText);
      setIsEditing(false);
    }
  };

  if (!isEditMode) {
    return <Component className={className}>{currentText}</Component>;
  }

  if (isEditing) {
    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          rows={3}
          className="w-full bg-[#1b222c] text-white border border-amber-500 rounded px-2 py-1 text-sm outline-none shadow-lg focus:ring-2 focus:ring-amber-500/50"
        />
      );
    }

    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="w-full max-w-lg bg-[#1b222c] text-white border border-amber-500 rounded px-2 py-0.5 text-sm outline-none shadow-lg focus:ring-2 focus:ring-amber-500/50"
      />
    );
  }

  return (
    <Component
      onClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
      title={`Click to edit [${contentKey}]`}
      className={`${className} cursor-pointer group relative inline-block transition-colors hover:bg-amber-500/10 rounded px-1 -mx-1 outline outline-1 outline-dashed outline-amber-500/40`}
    >
      {currentText}
      <span className="opacity-0 group-hover:opacity-100 absolute -top-3 -right-3 bg-amber-500 text-black rounded p-0.5 text-[9px] pointer-events-none shadow flex items-center gap-0.5">
        <Pencil className="w-2.5 h-2.5" />
      </span>
    </Component>
  );
};
