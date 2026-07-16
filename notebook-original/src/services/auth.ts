export interface User {
  id: string;
  email: string;
  displayName: string;
  provider: 'email' | 'google';
  createdAt: string;
}

class AuthService {
  private currentUser: User | null = null;

  constructor() {
    this.loadUser();
  }

  private loadUser() {
    const stored = localStorage.getItem('notebook_user');
    if (stored) {
      try {
        this.currentUser = JSON.parse(stored);
      } catch (e) {
        console.error('Load failed', e);
      }
    }
  }

  private saveUser() {
    if (this.currentUser) {
      localStorage.setItem('notebook_user', JSON.stringify(this.currentUser));
    }
  }

  async signUpWithEmail(email: string, password: string, displayName: string): Promise<User | null> {
    try {
      const existing = localStorage.getItem(`user_${email}`);
      if (existing) throw new Error('Email already in use');

      const userId = 'user_' + Date.now();
      const userData = {
        id: userId,
        email,
        displayName,
        password: btoa(password),
        createdAt: new Date().toISOString()
      };

      localStorage.setItem(`user_${email}`, JSON.stringify(userData));

      this.currentUser = {
        id: userId,
        email,
        displayName,
        provider: 'email',
        createdAt: new Date().toISOString()
      };

      this.saveUser();
      return this.currentUser;
    } catch (error) {
      console.error('Sign up failed', error);
      return null;
    }
  }

  async loginWithEmail(email: string, password: string): Promise<User | null> {
    try {
      const stored = localStorage.getItem(`user_${email}`);
      if (!stored) throw new Error('User not found');

      const userData = JSON.parse(stored);
      if (userData.password !== btoa(password)) throw new Error('Invalid password');

      this.currentUser = {
        id: userData.id,
        email: userData.email,
        displayName: userData.displayName,
        provider: 'email',
        createdAt: userData.createdAt
      };

      this.saveUser();
      return this.currentUser;
    } catch (error) {
      console.error('Login failed', error);
      return null;
    }
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('notebook_user');
  }

  getUser(): User | null {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }
}

export const authService = new AuthService();
