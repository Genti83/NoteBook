/**
 * Cloud Manager - Integrated Cloud Console
 * Midis Secrets & Backup buttons
 * Full notebook integration
 */

import React, { useState, useEffect } from 'react';
import {
  Cloud, Download, Upload, Trash2, Edit2, Save,
  Eye, EyeOff, Plus, X, Sync, RotateCw, FolderOpen
} from 'lucide-react';
import { gistCloud, GistData } from '../services/gistCloud';
import { Note } from '../types';

interface CloudManagerProps {
  notes: Note[];
  onNotesUpdate: (notes: Note[]) => void;
  username: string;
}

export const CloudManager: React.FC<CloudManagerProps> = ({
  notes,
  onNotesUpdate,
  username
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<'notes' | 'backup' | 'settings'>('notes');
  const [gistData, setGistData] = useState<GistData | null>(null);
  const [syncStatus, setSyncStatus] = useState('ready');
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadCloudData();
    }
  }, [isOpen]);

  const loadCloudData = async () => {
    setLoading(true);
    try {
      const data = await gistCloud.load();
      if (data) {
        setGistData(data);
        setLastSync(data.lastSync);
      }
    } catch (error) {
      console.error('Load cloud data failed', error);
    }
    setLoading(false);
  };

  const handleSync = async () => {
    setSyncStatus('syncing');
    try {
      const success = await gistCloud.sync(notes);
      if (success) {
        setSyncStatus('synced');
        setLastSync(new Date().toISOString());
        setTimeout(() => setSyncStatus('ready'), 2000);
      } else {
        setSyncStatus('error');
      }
    } catch (error) {
      console.error('Sync failed', error);
      setSyncStatus('error');
    }
  };

  const handleDownload = async () => {
    await gistCloud.downloadJSON(notes);
  };

  const handleImportJSON = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      const data = JSON.parse(content);
      
      if (data.notes && Array.isArray(data.notes)) {
        onNotesUpdate(data.notes);
        await handleSync();
      }
    } catch (error) {
      console.error('Import failed', error);
    }
  };

  const handleDeleteNote = async (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    onNotesUpdate(updated);
    await handleSync();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg font-semibold transition"
        title="Cloud Backup & Import/Export"
      >
        <Cloud className="w-5 h-5" />
        Cloud Backup
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-96 overflow-hidden flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="w-6 h-6" />
            <h2 className="text-xl font-bold">Cloud Backup & Sync</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setTab('notes')}
            className={`flex-1 py-2 font-semibold transition ${
              tab === 'notes'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            📝 Notes ({notes.length})
          </button>
          <button
            onClick={() => setTab('backup')}
            className={`flex-1 py-2 font-semibold transition ${
              tab === 'backup'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            💾 Backup
          </button>
          <button
            onClick={() => setTab('settings')}
            className={`flex-1 py-2 font-semibold transition ${
              tab === 'settings'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            ⚙️ Settings
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          
          {/* Notes Tab */}
          {tab === 'notes' && (
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : notes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No notes to backup
                </div>
              ) : (
                notes.map(note => (
                  <div
                    key={note.id}
                    className="border-l-4 border-yellow-400 bg-yellow-50 p-3 rounded-lg"
                  >
                    <h4 className="font-semibold text-sm text-gray-900">
                      {note.title}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {note.content}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Backup Tab */}
          {tab === 'backup' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-3">Sync Status</h4>
                
                <div className={`p-3 rounded mb-3 text-sm font-semibold ${
                  syncStatus === 'synced'
                    ? 'bg-green-100 text-green-700'
                    : syncStatus === 'syncing'
                    ? 'bg-blue-100 text-blue-700'
                    : syncStatus === 'error'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {syncStatus === 'synced' && '✓ Synced to Gist'}
                  {syncStatus === 'syncing' && '⟳ Syncing...'}
                  {syncStatus === 'error' && '✗ Error'}
                  {syncStatus === 'ready' && '⊙ Ready to sync'}
                </div>

                {lastSync && (
                  <p className="text-xs text-gray-600 mb-3">
                    Last sync: {new Date(lastSync).toLocaleString()}
                  </p>
                )}

                <div className="space-y-2">
                  <button
                    onClick={handleSync}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold"
                  >
                    <Sync className="w-4 h-4" />
                    Sync Now
                  </button>

                  <button
                    onClick={handleDownload}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-semibold"
                  >
                    <Download className="w-4 h-4" />
                    Download JSON
                  </button>

                  <label className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 font-semibold cursor-pointer">
                    <Upload className="w-4 h-4" />
                    Import JSON
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportJSON}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {tab === 'settings' && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Cloud Info</h4>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600 font-medium">User</p>
                    <p className="text-gray-900">{username}</p>
                  </div>

                  <div>
                    <p className="text-gray-600 font-medium">Gist ID</p>
                    <code className="block bg-gray-200 p-2 rounded text-xs break-all mt-1">
                      {gistCloud.getGistId() || 'Not synced'}
                    </code>
                  </div>

                  <div>
                    <p className="text-gray-600 font-medium">View Online</p>
                    {gistCloud.isInitialized() ? (
                      <a
                        href={gistCloud.getGistUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline block mt-1"
                      >
                        📖 Open GitHub Gist →
                      </a>
                    ) : (
                      <p className="text-gray-500 text-xs mt-1">
                        Not connected to Gist yet
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-gray-600 font-medium">Status</p>
                    <p className="text-xs mt-1">
                      {gistCloud.isInitialized()
                        ? '✓ Connected to Gist'
                        : '✗ Not connected'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-sm text-yellow-800">
                💡 <strong>Tip:</strong> Regular backups protect your data. Sync before closing the app!
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 p-4 flex justify-end gap-2">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
