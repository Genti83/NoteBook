/**
 * Main Notebook App with Cloud Integration
 * Cloud button midis Secrets & Backup
 */

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search } from 'lucide-react';
import { Note } from '../types';
import { CloudManager } from './CloudManager';
import { gistCloud } from '../services/gistCloud';

interface NotebookProps {
  username: string;
  onLogout: () => void;
}

export const Notebook: React.FC<NotebookProps> = ({ username, onLogout }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    loadNotes();
    // Enable auto-sync
    gistCloud.enableAutoSync(notes);

    return () => {
      gistCloud.disableAutoSync();
    };
  }, []);

  const loadNotes = () => {
    const stored = localStorage.getItem('notebook_notes');
    if (stored) {
      try {
        setNotes(JSON.parse(stored));
      } catch (e) {
        console.error('Load failed', e);
      }
    }
  };

  const saveNotes = (updatedNotes: Note[]) => {
    setNotes(updatedNotes);
    localStorage.setItem('notebook_notes', JSON.stringify(updatedNotes));
  };

  const handleAddNote = () => {
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
    saveNotes(updated);
    setNewNote('');
  };

  const handleDeleteNote = (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    saveNotes(updated);
  };

  const filteredNotes = notes.filter(
    note =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">📝 NoteBook3</h1>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
            >
              Logout
            </button>
          </div>

          {/* Search & Control Buttons */}
          <div className="flex gap-2 flex-wrap">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Control Buttons */}
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold">
              🔐 Secrets
            </button>

            {/* Cloud Manager Button - MIDIS SECRETS & BACKUP */}
            <CloudManager
              notes={notes}
              onNotesUpdate={saveNotes}
              username={username}
            />

            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold">
              📊 Backup
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4">
        
        {/* Add Note Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex gap-2">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a new note..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
            <button
              onClick={handleAddNote}
              disabled={!newNote.trim()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add
            </button>
          </div>
        </div>

        {/* Notes List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              {searchTerm ? 'No notes found' : 'No notes yet. Create your first note!'}
            </div>
          ) : (
            filteredNotes.map(note => (
              <div
                key={note.id}
                className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4 shadow-md hover:shadow-lg transition"
              >
                <h3 className="font-bold text-gray-900 mb-2">
                  {note.title}
                </h3>
                <p className="text-gray-700 mb-3 line-clamp-3">
                  {note.content}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
