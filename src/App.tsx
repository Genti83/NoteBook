import React, { useState, useEffect } from 'react';
import { authService } from './services/auth';
import { gistCloud } from './services/gistCloud';
import { LoginPage } from './components/LoginPage';
import { CloudConsole } from './components/CloudConsole';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(authService.isLoggedIn());
  const [user, setUser] = useState(authService.getUser());
  const [showConsole, setShowConsole] = useState(false);

  useEffect(() => {
    const currentUser = authService.getUser();
    if (currentUser) {
      setIsLoggedIn(true);
      setUser(currentUser);
      setShowConsole(true); // Auto-open console on login
    }
  }, []);

  const handleLoginSuccess = async () => {
    const currentUser = authService.getUser();
    if (currentUser) {
      setUser(currentUser);
      setIsLoggedIn(true);
      setShowConsole(true); // Auto-open console after login
    }
  };

  const handleLogout = () => {
    authService.logout();
    gistCloud.logout();
    setIsLoggedIn(false);
    setUser(null);
    setShowConsole(false);
  };

  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  if (showConsole) {
    return <CloudConsole onLogout={handleLogout} />;
  }

  return <div>Loading...</div>;
}
