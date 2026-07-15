import React, { useState } from 'react';
import { authService } from './services/auth';
import { gistCloud } from './services/gistCloud';
import { LoginPage } from './components/LoginPage';
import { Notebook } from './components/Notebook';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(authService.isLoggedIn());
  const [user, setUser] = useState(authService.getUser());

  const handleLoginSuccess = async () => {
    const currentUser = authService.getUser();
    if (currentUser) {
      setUser(currentUser);
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    authService.logout();
    gistCloud.logout();
    setIsLoggedIn(false);
    setUser(null);
  };

  if (!isLoggedIn || !user) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return <Notebook username={user.displayName} onLogout={handleLogout} />;
}
