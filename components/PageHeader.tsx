
import React from 'react';

const BackArrowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);


interface PageHeaderProps {
  title: string;
  onBack?: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, onBack }) => {
  return (
    <header className="bg-brand-primary text-white p-4 flex items-center justify-center shadow-md sticky top-0 z-10 relative">
      {onBack && (
         <button onClick={onBack} className="absolute left-4 p-2 -ml-2 rounded-full hover:bg-white/20 transition-colors">
            <BackArrowIcon />
        </button>
      )}
      <h1 className="text-xl font-semibold">{title}</h1>
    </header>
  );
};

export default PageHeader;