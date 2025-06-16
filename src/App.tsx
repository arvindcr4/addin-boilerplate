import React, { useEffect, useState } from 'react';
import { FluentProvider, webLightTheme, webDarkTheme } from '@fluentui/react-components';
import { TaskPane } from './pages/TaskPane';
import { Settings } from './pages/Settings';
import { Benchmark } from './pages/Benchmark';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

function AppContent() {
  const { actualTheme } = useTheme();
  const fluentTheme = actualTheme === 'dark' ? webDarkTheme : webLightTheme;
  const [currentPage, setCurrentPage] = useState<'taskpane' | 'settings' | 'benchmark'>('taskpane');

  useEffect(() => {
    // Determine which page to show based on the HTML file
    const path = window.location.pathname;
    if (path.includes('settings')) {
      setCurrentPage('settings');
    } else if (path.includes('benchmark')) {
      setCurrentPage('benchmark');
    } else {
      setCurrentPage('taskpane');
    }
  }, []);

  return (
    <FluentProvider theme={fluentTheme}>
      {currentPage === 'taskpane' && <TaskPane />}
      {currentPage === 'settings' && <Settings />}
      {currentPage === 'benchmark' && <Benchmark />}
    </FluentProvider>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}