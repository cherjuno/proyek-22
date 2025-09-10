// Fix: Implemented the HomePage component to act as the main dashboard.
import React from 'react';
import { Page } from '../types';

interface HomePageProps {
  setCurrentPage: (page: Page) => void;
  onLogout: () => void;
  isLoggedIn: boolean;
}

const FeatureCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  color: string;
}> = ({ title, description, icon, onClick, color }) => (
  <button
    onClick={onClick}
    className={`p-6 rounded-2xl shadow-lg text-left w-full transition-transform transform hover:-translate-y-1 hover:shadow-2xl ${color}`}
  >
    <div className="flex items-center mb-2">
      <div className="p-2 bg-white/30 rounded-full mr-4">{icon}</div>
      <h3 className="text-2xl font-bold text-white">{title}</h3>
    </div>
    <p className="text-white/90">{description}</p>
  </button>
);

const ChatBubbleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const BookOpenIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const PencilIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" />
    </svg>
);

const ClipboardListIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
);

const MapIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 13v-5.5m6 5.5v-5.5" />
    </svg>
);

const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);


const HomePage: React.FC<HomePageProps> = ({ setCurrentPage, onLogout, isLoggedIn }) => {
  return (
    <div className="h-full bg-brand-bg overflow-y-auto">
        <header className="p-6">
            <h1 className="text-4xl font-bold text-brand-text">Welcome!</h1>
            <p className="text-lg text-gray-600">What would you like to do today?</p>
        </header>

        <main className="p-6 pt-0 space-y-5">
            <FeatureCard 
                title="Learning Pal"
                description="Your AI study partner. Ask questions, get explanations."
                icon={<ChatBubbleIcon />}
                onClick={() => setCurrentPage(Page.LearningPal)}
                color="bg-gradient-to-br from-cyan-500 to-blue-500"
            />
            <FeatureCard 
                title="Task Track"
                description="Organize your study schedule and track daily quests."
                icon={<ClipboardListIcon />}
                onClick={() => setCurrentPage(Page.TaskTrack)}
                color="bg-gradient-to-br from-purple-500 to-indigo-500"
            />
            <FeatureCard 
                title="Learn Box"
                description="Create and review flashcards to memorize key concepts."
                icon={<BookOpenIcon />}
                onClick={() => setCurrentPage(Page.LearnBox)}
                color="bg-gradient-to-br from-green-500 to-teal-500"
            />
             <FeatureCard 
                title="Quick Scribble"
                description="Jot down quick notes and ideas for any subject."
                icon={<PencilIcon />}
                onClick={() => setCurrentPage(Page.QuickScribble)}
                color="bg-gradient-to-br from-yellow-500 to-orange-500"
            />
            <FeatureCard 
                title="Map It"
                description="Visualize your notes with AI-generated mind maps."
                icon={<MapIcon />}
                onClick={() => setCurrentPage(Page.MapIt)}
                color="bg-gradient-to-br from-pink-500 to-rose-500"
            />
            {isLoggedIn && (
                 <button onClick={onLogout} className="w-full mt-4 bg-red-500 text-white font-semibold py-3 px-4 rounded-lg shadow-sm hover:bg-red-600 transition-colors flex items-center justify-center">
                    <LogoutIcon />
                    Logout
                </button>
            )}
        </main>
    </div>
  );
};

export default HomePage;