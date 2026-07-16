export interface GistData {
  notes: any[];
  lastSync: string;
  syncedBy: string;
}

class GistCloudService {
  private gistId: string | null = null;
  private accessToken: string | null = null;
  private username: string | null = null;

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
      const existing = gists.find(g => g.description?.includes('NoteBook'));

      if (existing) return existing.id;

      return await this.createGist();
    } catch (error) {
      console.error('Find gist failed', error);
      return null;
    }
  }

  private async createGist(): Promise<string | null> {
    try {
      const response = await fetch('https://api.github.com/gists', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          description: 'NoteBook Backup - ' + this.username,
          public: false,
          files: {
            'notebook-data.json': {
              content: JSON.stringify({ notes: [], lastSync: new Date().toISOString() }, null, 2)
            }
          }
        })
      });

      if (!response.ok) throw new Error('Failed to create gist');
      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error('Create gist failed', error);
      return null;
    }
  }

  async sync(data: any): Promise<boolean> {
    if (!this.gistId || !this.accessToken) return false;

    try {
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
              content: JSON.stringify({ ...data, lastSync: new Date().toISOString(), syncedBy: this.username }, null, 2)
            }
          }
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Sync failed', error);
      return false;
    }
  }

  isInitialized(): boolean {
    return !!(this.accessToken && this.gistId);
  }

  logout(): void {
    this.gistId = null;
    this.accessToken = null;
    this.username = null;
    localStorage.removeItem('gist_id');
    localStorage.removeItem('gist_token');
    localStorage.removeItem('gist_username');
  }
}

export const gistCloud = new GistCloudService();
