'use client';

import { useState } from 'react';
import { Trash2, Edit3, Check } from 'lucide-react';

interface Thought {
  id: string;
  text: string;
  timestamp: Date;
}

interface ThoughtCardProps {
  thought: Thought;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, newText: string) => void;
}

export default function ThoughtCard({
  thought,
  isSelected,
  onSelect,
  onDelete,
  onUpdate
}: ThoughtCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(thought.text);

  const handleSave = () => {
    if (editText.trim() !== thought.text) {
      onUpdate(thought.id, editText.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(thought.text);
    setIsEditing(false);
  };

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div
      className={`p-4 rounded-lg transition-all cursor-pointer ${isSelected
        ? 'border-blue-500 bg-blue-500/20'
        : 'border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10'
        }`}
      onClick={() => onSelect(thought.id)}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div
            className={`w-4 h-4 rounded border-2 flex items-center justify-center ${isSelected
              ? 'border-blue-500 bg-blue-500'
              : 'border-white/40'
              }`}
          >
            {isSelected && <Check className="w-3 h-3 text-white" />}
          </div>
          <span className="text-sm text-gray-400">
            {formatTimestamp(thought.timestamp)}
          </span>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(thought.id);
            }}
            className="p-1 text-gray-400 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full p-2 border border-white/20 bg-white/10 text-white rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            rows={3}
            onClick={(e) => e.stopPropagation()}
          />
          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
            >
              Save
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCancel();
              }}
              className="px-3 py-1 bg-white/20 text-white text-sm rounded hover:bg-white/30 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-white leading-relaxed">{thought.text}</p>
      )}
    </div>
  );
}

