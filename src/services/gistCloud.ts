import { Note } from '../types';

export interface GistData {
  notes: Note[];
  settings: Record<string, unknown>;
  version: string;
  lastSync: string;
  syncedBy: string;
  syncCount: number;
}

class GistCloudService {
  private gistId: string | null = null;
  private accessToken: string | null = null;
  private username: string | null = null;
  private autoSyncInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    this.gistId = localStorage.getItem('gist_id');
    this.accessToken = localStorage.getItem('gist_token');
    this.username = localStorage.getItem('gist_username');
  }

  private saveToStorage() {
    if (this.gistId) localStorage.setItem('gist_id', this.gistId);
    if (this.accessToken) localStorage.setItem('gist_token', this.accessToken);
    if (this.username) localStorage.setItem('gist_username', this.username);
  }

  async initialize(token: string, username: string): Promise<boolean> {
    try {
      this.accessToken = token;
      this.username = username;

      const gistId = await this.findOrCreateGist();
      if (gistId) {
        this.gistId = gistId;
        this.saveToStorage();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Gist init failed', error);
      return false;
    }
  }

  private async findOrCreateGist(): Promise<string | null> {
    try {
      const response = await fetch('https://api.github.com/user/gists', {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) throw new Error('Failed to list gists');

      const gists: any[] = await response.json();
      const existing = gists.find(g =>
        g.description?.includes('NoteBook3') ||
        g.files['notebook-data.json']
      );

      if (existing) {
        console.log('Found existing Gist:', existing.id);
        return existing.id;
      }

      return await this.createGist();
    } catch (error) {
      console.error('Find gist failed', error);
      return null;
    }
  }

  private async createGist(): Promise<string | null> {
    try {
      const initialData: GistData = {
        notes: [],
        settings: { theme: 'light', language: 'sq', autoSync: true },
        version: '1.0',
        lastSync: new Date().toISOString(),
        syncedBy: this.username || 'system',
        syncCount: 0
      };

      const response = await fetch('https://api.github.com/gists', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          description: 'NoteBook3 Cloud Backup - ' + this.username,
          public: false,
          files: {
            'notebook-data.json': {
              content: JSON.stringify(initialData, null, 2)
            }
          }
        })
      });

      if (!response.ok) throw new Error('Failed to create gist');

      const data = await response.json();
      console.log('Gist created:', data.id);
      return data.id;
    } catch (error) {
      console.error('Create gist failed', error);
      return null;
    }
  }

  async sync(notes: Note[], settings?: Record<string, unknown>): Promise<boolean> {
    if (!this.gistId || !this.accessToken) {
      console.warn('Gist not initialized');
      return false;
    }

    try {
      const data: GistData = {
        notes,
        settings: settings || {},
        version: '1.0',
        lastSync: new Date().toISOString(),
        syncedBy: this.username || 'system',
        syncCount: ((await this.load())?.syncCount || 0) + 1
      };

      const response = await fetch(`https://api.github.com/gists/${this.gistId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          files: {
            'notebook-data.json': {
              content: JSON.stringify(data, null, 2)
            }
          }
        })
      });

      if (response.ok) {
        console.log('Synced to Gist at', data.lastSync);
      }
      return response.ok;
    } catch (error) {
      console.error('Sync failed', error);
      return false;
    }
  }

  async load(): Promise<GistData | null> {
    if (!this.gistId || !this.accessToken) return null;

    try {
      const response = await fetch(`https://api.github.com/gists/${this.gistId}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) throw new Error('Failed to load gist');

      const gist: any = await response.json();
      const file = gist.files['notebook-data.json'];

      if (!file) return null;

      return JSON.parse(file.content);
    } catch (error) {
      console.error('Load failed', error);
      return null;
    }
  }

  enableAutoSync(notes: Note[], settings?: Record<string, unknown>): void {
    if (this.autoSyncInterval) {
      clearInterval(this.autoSyncInterval);
    }

    this.autoSyncInterval = setInterval(() => {
      this.sync(notes, settings);
    }, 5 * 60 * 1000);
  }

  disableAutoSync(): void {
    if (this.autoSyncInterval) {
      clearInterval(this.autoSyncInterval);
      this.autoSyncInterval = null;
    }
  }

  async downloadJSON(notes: Note[]): Promise<void> {
    const data = {
      notes,
      exportedAt: new Date().toISOString(),
      exportedBy: this.username
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notebook-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  getGistUrl(): string {
    return `https://gist.github.com/${this.username}/${this.gistId}`;
  }

  isInitialized(): boolean {
    return !!(this.accessToken && this.gistId);
  }

  getGistId(): string | null {
    return this.gistId;
  }

  logout(): void {
    this.gistId = null;
    this.accessToken = null;
    this.username = null;
    localStorage.removeItem('gist_id');
    localStorage.removeItem('gist_token');
    localStorage.removeItem('gist_username');
    this.disableAutoSync();
  }
}

export const gistCloud = new GistCloudService();
