"use client";

import { useState, useEffect } from 'react';
import { Edit3, Check, X, ChevronDown, Volume2 } from 'lucide-react';
import { apiClient } from '@/utils/apiClient';
import ReactMarkdown from 'react-markdown';

interface AudioFile {
  id: string;
  path: string;
  transcript: string;
  summary: string;
  classification: string;
  sentiment: string;
  severity: string;
  resolved: boolean;
  createdAt: string;
}

interface CallsTabProps {
  calls: AudioFile[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export function CallsTab({ calls, loading, error, onRefresh }: CallsTabProps) {
  const [selectedClassification, setSelectedClassification] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newClassification, setNewClassification] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const classifications = [
    { value: 'all', label: 'All Calls', count: calls.length },
    { value: 'complaint', label: 'Complaints', count: calls.filter(call => call.classification === 'complaint').length },
    { value: 'compliment', label: 'Compliments', count: calls.filter(call => call.classification === 'compliment').length },
    { value: 'uncategorised', label: 'Uncategorized', count: calls.filter(call => !call.classification || call.classification === 'uncategorised').length },
  ];

  const filteredCalls = selectedClassification === 'all' 
    ? calls 
    : calls.filter(call => call.classification === selectedClassification);

  const handleUpdateClassification = async (id: string, classification: string) => {
    try {
      await apiClient.put(`/speech/audio/${id}/classification`, { classification });
      onRefresh();
      setEditingId(null);
    } catch (error) {
      console.error('Failed to update classification:', error);
    }
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'complaint':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'compliment':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'uncategorised':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'POSITIVE':
        return 'text-green-600';
      case 'NEGATIVE':
        return 'text-red-600';
      case 'NEUTRAL':
        return 'text-gray-600';
      default:
        return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading calls...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Classification Filter */}
      <div className="flex gap-2 flex-wrap">
        {classifications.map((classification) => (
          <button
            key={classification.value}
            onClick={() => setSelectedClassification(classification.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedClassification === classification.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {classification.label} ({classification.count})
          </button>
        ))}
      </div>

      {/* Calls List - Accordion Style */}
      <div className="rounded-lg border border-gray-700 overflow-hidden" style={{ backgroundColor: '#212121' }}>
        {filteredCalls.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            No calls found for the selected classification.
          </div>
        ) : (
          filteredCalls.map((call, index) => (
            <div key={call.id} className={`border-b border-gray-700 ${index === filteredCalls.length - 1 ? 'border-b-0' : ''}`}>
              {/* Accordion Header */}
              <div 
                className="flex items-center justify-between p-4 hover:bg-gray-800 cursor-pointer transition-colors"
                onClick={() => setExpandedId(expandedId === call.id ? null : call.id)}
              >
                <div className="flex items-center gap-3 flex-1">
                  {/* Checkbox */}
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                    checked={false}
                    onChange={() => {}}
                  />
                  
                  {/* Main Content */}
                  <div className="flex-1">
                    {/* Title */}
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getClassificationColor(call.classification)}`}>
                        [{call.classification || 'uncategorised'}] {call.classification || 'call'}
                      </span>
                    </div>
                    
                    {/* Metadata */}
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <Volume2 size={14} className="text-blue-400" />
                      <span>Call</span>
                      <span>•</span>
                      <span className="font-mono text-xs">{call.id.substring(0, 8)}</span>
                      <span>•</span>
                      <span>sagecall</span>
                    </div>
                    
                    {/* Description Snippet */}
                    <p className="text-sm text-gray-300 line-clamp-2">
                      {call.transcript ? (
                        call.transcript.length > 100 
                          ? `${call.transcript.substring(0, 100)}...`
                          : call.transcript
                      ) : (
                        <span className="text-gray-500">No transcript available</span>
                      )}
                    </p>
                  </div>
                </div>
                
                {/* Right side - Time and Chevron */}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400">
                    {new Date(call.createdAt).toLocaleDateString() === new Date().toLocaleDateString() 
                      ? `${Math.floor((Date.now() - new Date(call.createdAt).getTime()) / (1000 * 60))} minutes ago`
                      : new Date(call.createdAt).toLocaleDateString()
                    }
                  </span>
                  <ChevronDown 
                    size={16} 
                    className={`text-gray-400 transition-transform ${expandedId === call.id ? 'rotate-180' : ''}`}
                  />
                </div>
              </div>

              {/* Expanded Content */}
              {expandedId === call.id && (
                <div className="px-4 pb-4 bg-gray-800 border-t border-gray-700">
                  <div className="space-y-4">
                    {/* Audio Player */}
                    {call.path && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Audio:</h4>
                        <div className="bg-gray-900 rounded border border-gray-600 p-3">
                          <audio controls className="w-full h-8">
                            <source src={call.path} type="audio/mpeg" />
                            <source src={call.path} type="audio/wav" />
                            <source src={call.path} type="audio/ogg" />
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      </div>
                    )}

                    {/* Full Transcript */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Full Transcript:</h4>
                      <div className="bg-gray-900 rounded border border-gray-600 p-3 text-sm text-gray-300 max-h-40 overflow-y-auto">
                        {call.transcript || <span className="text-gray-500">No transcript available</span>}
                      </div>
                    </div>

                    {/* Summary */}
                    {call.summary && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Summary:</h4>
                        <div className="bg-gray-900 rounded border border-gray-600 p-3 text-sm text-gray-300 prose prose-invert prose-sm max-w-none">
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                              ul: ({ children }) => <ul className="list-disc list-inside mb-2">{children}</ul>,
                              ol: ({ children }) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
                              li: ({ children }) => <li className="mb-1">{children}</li>,
                              strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                              em: ({ children }) => <em className="italic">{children}</em>,
                              code: ({ children }) => <code className="bg-gray-800 px-1 py-0.5 rounded text-xs">{children}</code>,
                              blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-600 pl-4 italic">{children}</blockquote>,
                            }}
                          >
                            {call.summary}
                          </ReactMarkdown>
                        </div>
                      </div>
                    )}

                    {/* Classification Editor */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingId(call.id);
                          setNewClassification(call.classification || '');
                        }}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        Edit Classification
                      </button>
                    </div>

                    {/* Classification Editor */}
                    {editingId === call.id && (
                      <div className="bg-gray-900 rounded border border-gray-600 p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <label className="text-sm font-medium text-gray-300">Update Classification:</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={newClassification}
                            onChange={(e) => setNewClassification(e.target.value)}
                            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500"
                          >
                            <option value="">Select Classification</option>
                            <option value="complaint">Complaint</option>
                            <option value="compliment">Compliment</option>
                            <option value="uncategorised">Uncategorized</option>
                          </select>
                          <button
                            onClick={() => handleUpdateClassification(call.id, newClassification)}
                            className="p-2 text-green-400 hover:text-green-300 transition-colors"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-2 text-red-400 hover:text-red-300 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
