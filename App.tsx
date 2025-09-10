// Fix: Populated the file with a root component that manages application state and routing.
import React, { useState } from 'react';
import { Page } from './types';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import LearningPalPage from './pages/LearningPalPage';
import TaskTrackPage from './pages/TaskTrackPage';
import LearnBoxPage from './pages/LearnBoxPage';
import QuickScribblePage from './pages/QuickScribblePage';
import BottomNavBar from './components/BottomNavBar';
import useLocalStorage from './hooks/useLocalStorage';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage('isLoggedIn', false);
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage(Page.Home);
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage(Page.Home); // Or redirect to login
  }

  const handleSetPage = (page: Page) => {
    if (page === Page.MapIt) {
      setCurrentPage(Page.LearnBox);
    } else {
      setCurrentPage(page);
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case Page.Home:
        return <HomePage setCurrentPage={handleSetPage} onLogout={handleLogout} isLoggedIn={isLoggedIn} />;
      case Page.LearningPal:
        return <LearningPalPage setCurrentPage={handleSetPage} />;
      case Page.TaskTrack:
        return <TaskTrackPage setCurrentPage={handleSetPage} />;
      case Page.LearnBox:
        return <LearnBoxPage setCurrentPage={handleSetPage} />;
      case Page.QuickScribble:
        return <QuickScribblePage setCurrentPage={handleSetPage} />;
      default:
        return <HomePage setCurrentPage={handleSetPage} onLogout={handleLogout} isLoggedIn={isLoggedIn} />;
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-200 flex items-center justify-center p-4">
      {/* This div creates a phone-like frame that enforces a portrait aspect ratio */}
      <div className="w-full max-w-sm h-full max-h-[812px] aspect-[9/16] font-sans flex flex-col bg-brand-bg shadow-2xl rounded-2xl overflow-hidden border-2 border-gray-700">
        {!isLoggedIn ? (
          <LoginPage onLogin={handleLogin} />
        ) : (
          <>
            <main className="flex-grow overflow-y-auto">
              {renderPage()}
            </main>
            { currentPage !== Page.Home && <BottomNavBar currentPage={currentPage} setCurrentPage={setCurrentPage} /> }
          </>
        )}
      </div>
    </div>
  );
};

export default App;