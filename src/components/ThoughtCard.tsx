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
      className={`relative p-4 rounded-2xl border transition-all duration-500 cursor-pointer overflow-hidden group ${isSelected
        ? 'border-blue-400/50'
        : 'border-white/20 hover:border-white/30'
        }`}
      style={{
        background: isSelected
          ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%)'
          : 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
        boxShadow: isSelected
          ? '0 8px 32px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255,255,255,0.2)'
          : '0 4px 16px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.1)'
      }}
      onClick={() => onSelect(thought.id)}
    >
      {/* Liquid Glass shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

      <div className="flex items-start justify-between mb-2 relative z-10">
        <div className="flex items-center space-x-2">
          <div
            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isSelected
              ? 'border-blue-400 bg-blue-400 shadow-lg'
              : 'border-white/40 hover:border-white/60'
              }`}
            style={isSelected ? { boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)' } : {}}
          >
            {isSelected && <Check className="w-3 h-3 text-white" />}
          </div>
          <span className="text-sm text-white/60 font-medium">
            {formatTimestamp(thought.timestamp)}
          </span>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            className="p-2 text-white/60 hover:text-white transition-all duration-300 rounded-lg hover:bg-white/10"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(thought.id);
            }}
            className="p-2 text-white/60 hover:text-red-400 transition-all duration-300 rounded-lg hover:bg-red-500/10"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-3 relative z-10">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full p-3 border border-white/20 bg-white/5 text-white rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-400/50 placeholder-white/40 backdrop-blur-sm"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)'
            }}
            rows={3}
            onClick={(e) => e.stopPropagation()}
          />
          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
              className="px-4 py-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm rounded-xl hover:bg-blue-500/30 transition-all duration-300 backdrop-blur-sm"
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%)',
                boxShadow: '0 4px 16px rgba(59, 130, 246, 0.2)'
              }}
            >
              Save
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCancel();
              }}
              className="px-4 py-2 bg-white/10 border border-white/20 text-white text-sm rounded-xl hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-white/90 leading-relaxed relative z-10">{thought.text}</p>
      )}
    </div>
  );
}

