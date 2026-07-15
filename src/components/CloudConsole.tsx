/**
 * Cloud Console - Complete Gist Management UI
 * Edit, Save, Delete, Download, Backup, Preview, AI
 */

import React, { useState, useEffect } from 'react';
import { 
  Cloud, Download, Upload, Trash2, Edit2, Save, 
  Eye, Wand2, RotateCw, LogOut, Plus, X, Check
} from 'lucide-react';
import { gistCloud, GistData } from '../services/gistCloud';
import { authService, User } from '../services/auth';
import { Note } from '../types';

interface CloudConsoleProps {
  onLogout: () => void;
}

export const CloudConsole: React.FC<CloudConsoleProps> = ({ onLogout }) => {
  const user = authService.getUser();
  const [notes, setNotes] = useState<Note[]>([]);
  const [gistData, setGistData] = useState<GistData | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newNote, setNewNote] = useState('');
  const [syncStatus, setSyncStatus] = useState('ready');
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'list' | 'preview' | 'settings'>('list');
  const [aiSuggestion, setAiSuggestion] = useState('');

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    setLoading(true);
    try {
      const data = await gistCloud.load();
      if (data) {
        setGistData(data);
        setNotes(data.notes || []);
        setLastSync(data.lastSync);
      } else {
        // Load from local storage
        const local = localStorage.getItem('notebook_notes');
        if (local) {
          setNotes(JSON.parse(local));
        }
      }
    } catch (error) {
      console.error('Load failed', error);
    }
    setLoading(false);
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    const note: Note = {
      id: 'note_' + Date.now(),
      title: newNote.substring(0, 50),
      content: newNote,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
      color: 'yellow'
    };

    const updated = [...notes, note];
    setNotes(updated);
    setNewNote('');

    // Save locally
    localStorage.setItem('notebook_notes', JSON.stringify(updated));

    // Sync to cloud
    await syncToCloud(updated);
  };

  const handleDeleteNote = async (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    localStorage.setItem('notebook_notes', JSON.stringify(updated));
    await syncToCloud(updated);
  };

  const handleUpdateNote = async (id: string, content: string) => {
    const updated = notes.map(n =>
      n.id === id
        ? { ...n, content, updatedAt: new Date().toISOString() }
        : n
    );
    setNotes(updated);
    setEditingId(null);
    localStorage.setItem('notebook_notes', JSON.stringify(updated));
    await syncToCloud(updated);
  };

  const syncToCloud = async (notesToSync: Note[]) => {
    setSyncStatus('syncing');
    try {
      const success = await gistCloud.sync(notesToSync);
      if (success) {
        setSyncStatus('synced');
        setLastSync(new Date().toISOString());
        setTimeout(() => setSyncStatus('ready'), 2000);
      } else {
        setSyncStatus('error');
      }
    } catch (error) {
      console.error('Sync error', error);
      setSyncStatus('error');
    }
  };

  const downloadBackup = async () => {
    await gistCloud.downloadJSON(notes);
  };

  const generateAISuggestion = async (noteContent: string) => {
    try {
      // Using Gemini API
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': import.meta.env.VITE_GEMINI_API_KEY || ''
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Analyze this note and provide a brief suggestion: "${noteContent}"`
            }]
          }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const suggestion = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No suggestions';
        setAiSuggestion(suggestion);
      }
    } catch (error) {
      console.error('AI suggestion failed', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Cloud className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">NoteBook3 Cloud</h1>
              <p className="text-sm text-gray-600">{user?.displayName}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">
                {syncStatus === 'synced' && '✓ Synced to Gist'}
                {syncStatus === 'syncing' && '⟳ Syncing...'}
                {syncStatus === 'error' && '✗ Sync error'}
                {syncStatus === 'ready' && 'Ready'}
              </p>
              {lastSync && (
                <p className="text-xs text-gray-500">
                  Last: {new Date(lastSync).toLocaleTimeString()}
                </p>
              )}
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-semibold"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Notes Manager */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add Note */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create New Note
            </h2>
            <div className="flex gap-2">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Write your note here..."
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
              />
              <button
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
              >
                Add
              </button>
            </div>
          </div>

          {/* Notes List */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">
              Notes ({notes.length})
            </h2>

            {loading ? (
              <div className="text-center py-8 text-gray-600">Loading notes...</div>
            ) : notes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No notes yet. Create your first note above! 📝
              </div>
            ) : (
              <div className="space-y-3">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="border-l-4 border-yellow-400 bg-yellow-50 p-4 rounded-lg hover:shadow-md transition"
                  >
                    {editingId === note.id ? (
                      <div className="space-y-2">
                        <textarea
                          defaultValue={note.content}
                          onChange={(e) => setNewNote(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          rows={4}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateNote(note.id, newNote)}
                            className="flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                          >
                            <Save className="w-4 h-4" />
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {note.title}
                        </h3>
                        <p className="text-gray-700 mb-3">{note.content}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>
                            {new Date(note.createdAt).toLocaleDateString()}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingId(note.id);
                                setNewNote(note.content);
                              }}
                              className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => generateAISuggestion(note.content)}
                              className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                            >
                              <Wand2 className="w-4 h-4" />
                              AI
                            </button>
                            <button
                              onClick={() => handleDeleteNote(note.id)}
                              className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right - Cloud Console */}
        <div className="space-y-6">
          {/* Sync Status */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <RotateCw className="w-5 h-5" />
              Cloud Sync
            </h3>
            <div className="space-y-3">
              <div className={`p-3 rounded-lg text-sm font-semibold ${
                syncStatus === 'synced'
                  ? 'bg-green-100 text-green-700'
                  : syncStatus === 'syncing'
                  ? 'bg-blue-100 text-blue-700'
                  : syncStatus === 'error'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                Status: {syncStatus.toUpperCase()}
              </div>

              <button
                onClick={() => syncToCloud(notes)}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold"
              >
                <RotateCw className="w-4 h-4" />
                Sync Now
              </button>

              <button
                onClick={downloadBackup}
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-semibold"
              >
                <Download className="w-4 h-4" />
                Download Backup
              </button>
            </div>
          </div>

          {/* Gist Info */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold mb-4">Gist Info</h3>
            <div className="space-y-2 text-sm">
              <p>
                <strong>ID:</strong>
                <br />
                <code className="bg-gray-100 p-2 rounded text-xs break-all">
                  {gistCloud.getGistId() || 'Not synced'}
                </code>
              </p>
              <p>
                <strong>Last Sync:</strong>
                <br />
                {lastSync
                  ? new Date(lastSync).toLocaleString()
                  : 'Never'}
              </p>
              <a
                href={gistCloud.isInitialized() ? gistCloud.getGistUrl() : '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline block mt-3"
              >
                📖 View on GitHub Gist →
              </a>
            </div>
          </div>

          {/* AI Suggestions */}
          {aiSuggestion && (
            <div className="bg-purple-50 border-l-4 border-purple-400 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-purple-600" />
                AI Suggestion
              </h3>
              <p className="text-sm text-gray-700">{aiSuggestion}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
