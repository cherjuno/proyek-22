import React from 'react';
import { Page } from '../types';

interface BottomNavBarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const NavButton: React.FC<{
  onClick: () => void;
  label: string;
  children: React.ReactNode;
  active: boolean;
}> = ({ onClick, label, children, active }) => (
  <button
    onClick={onClick}
    aria-label={label}
    className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors ${active ? 'text-brand-primary' : 'text-gray-500 hover:text-brand-primary'}`}
  >
    {children}
    <span className={`text-xs mt-1 ${active ? 'font-bold' : ''}`}>{label}</span>
  </button>
);


const HomeIcon = ({ active }: { active: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

const ClipboardListIcon = ({ active }: { active: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
);

const BookOpenIcon = ({ active }: { active: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);


const ChatBubbleIcon = ({ active }: { active: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentPage, setCurrentPage }) => {
    
    if (currentPage === Page.Home) return null;

    const navItems = [
        { page: Page.Home, label: 'Home', Icon: HomeIcon },
        { page: Page.TaskTrack, label: 'Tasks', Icon: ClipboardListIcon },
        { page: Page.LearnBox, label: 'Learn Box', Icon: BookOpenIcon },
        { page: Page.LearningPal, label: 'AI Pal', Icon: ChatBubbleIcon },
    ];
    
  return (
    <nav className="bg-white border-t border-gray-200 flex flex-shrink-0 shadow-inner">
        {navItems.map(({ page, label, Icon }) => (
            <NavButton
                key={label}
                onClick={() => setCurrentPage(page)}
                label={label}
                active={currentPage === page}
            >
                <Icon active={currentPage === page} />
            </NavButton>
        ))}
    </nav>
  );
};

export default BottomNavBar;