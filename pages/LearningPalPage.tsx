import React, { useState, useEffect, useRef } from 'react';
import { Page, ChatMessage, Media, Conversation } from '../types';
import { sendMessageToAI } from '../services/geminiService';
import useLocalStorage from '../hooks/useLocalStorage';

interface LearningPalPageProps {
  setCurrentPage: (page: Page) => void;
}

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);

const BackArrowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
);

const CameraIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const PhotoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const NewChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const initialMessage: ChatMessage = { 
  sender: 'ai', 
  text: "Learning Pal at your humble service, my friend. How can I help you today?" 
};

const HistoryPanel: React.FC<{
    isOpen: boolean;
    conversations: Conversation[];
    activeConversationId: string | null;
    onSelect: (id: string) => void;
    onDelete: (id: string) => void;
    onNewChat: () => void;
    onClose: () => void;
}> = ({ isOpen, conversations, activeConversationId, onSelect, onDelete, onNewChat, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="absolute inset-0 bg-black/50 z-20 flex justify-end" onClick={onClose}>
            <div className="w-4/5 max-w-xs h-full bg-brand-bg shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold">Chat History</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
                </div>
                <div className="flex-grow overflow-y-auto">
                    {conversations.sort((a,b) => b.startTime - a.startTime).map(conv => (
                        <div key={conv.id} className={`p-3 m-2 rounded-lg group flex justify-between items-center cursor-pointer ${conv.id === activeConversationId ? 'bg-brand-primary/20' : 'hover:bg-gray-200'}`} onClick={() => onSelect(conv.id)}>
                            <div className="truncate">
                                <p className="font-semibold text-sm truncate">{conv.messages[1]?.text || conv.messages[0]?.text}</p>
                                <p className="text-xs text-gray-500">{new Date(conv.startTime).toLocaleString()}</p>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); onDelete(conv.id); }} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 p-1 flex-shrink-0 ml-2">
                                <TrashIcon />
                            </button>
                        </div>
                    ))}
                </div>
                <div className="p-2 border-t">
                    <button onClick={onNewChat} className="w-full bg-brand-primary text-white font-semibold py-3 rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center">
                        <NewChatIcon /> <span className="ml-2">New Chat</span>
                    </button>
                </div>
            </div>
        </div>
    );
};


const LearningPalPage: React.FC<LearningPalPageProps> = ({ setCurrentPage }) => {
  const [conversations, setConversations] = useLocalStorage<Conversation[]>('learningPalConversations', []);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const messages = activeConversation?.messages || [];

  useEffect(() => {
    if (conversations.length > 0 && !activeConversationId) {
        setActiveConversationId(conversations[conversations.length - 1].id);
    } else if (conversations.length === 0) {
        handleNewChat();
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleNewChat = () => {
    const newConversation: Conversation = {
        id: Date.now().toString(),
        startTime: Date.now(),
        messages: [initialMessage],
    };
    setConversations(prev => [...prev, newConversation]);
    setActiveConversationId(newConversation.id);
    setIsHistoryOpen(false);
  };
  
  const handleDeleteConversation = (id: string) => {
    const remaining = conversations.filter(c => c.id !== id);
    setConversations(remaining);
    if (activeConversationId === id) {
        if (remaining.length > 0) {
            setActiveConversationId(remaining[remaining.length - 1].id);
        } else {
            handleNewChat();
        }
    }
  };
  
  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    setIsHistoryOpen(false);
  };

  const handleSendMessage = async (messageText: string, media?: Media) => {
    if ((messageText.trim() === '' && !media) || !activeConversationId) return;

    const userMessage: ChatMessage = { sender: 'user', text: messageText, media };
    
    const currentConv = conversations.find(c => c.id === activeConversationId);
    if (!currentConv) return;
    
    const historyForAI = [...currentConv.messages, userMessage].slice(1);

    setConversations(prev => prev.map(conv => 
        conv.id === activeConversationId 
        ? { ...conv, messages: [...conv.messages, userMessage] } 
        : conv
    ));

    setInput('');
    setIsLoading(true);

    const aiResponse = await sendMessageToAI(historyForAI);
    const aiMessage: ChatMessage = { sender: 'ai', text: aiResponse.text, sources: aiResponse.sources };

    setConversations(prev => prev.map(conv => 
        conv.id === activeConversationId 
        ? { ...conv, messages: [...conv.messages, aiMessage] } 
        : conv
    ));
    setIsLoading(false);
  };
  
  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
          const url = e.target?.result as string;
          const mimeType = file.type;
          let type: Media['type'] = 'image';
          if (mimeType.startsWith('video/')) type = 'video';
          if (mimeType.startsWith('audio/')) type = 'audio';
          
          handleSendMessage(input, { type, url, mimeType });
      };
      reader.readAsDataURL(file);
      setIsMenuOpen(false);
      event.target.value = '';
  };

  return (
    <div className="flex flex-col h-full bg-brand-bg relative">
        <header className="bg-brand-primary text-black p-4 flex items-center justify-between shadow-md sticky top-0 z-10 flex-shrink-0">
            <button onClick={() => setCurrentPage(Page.Home)} className="p-2 -ml-2 rounded-full text-white hover:bg-white/20 transition-colors">
                <BackArrowIcon />
            </button>
            <h1 className="text-xl font-serif font-bold text-black">Learning Pal</h1>
            <div className="flex items-center gap-1">
                <button onClick={handleNewChat} className="p-2 rounded-full text-white hover:bg-white/20 transition-colors" aria-label="New Chat">
                    <NewChatIcon />
                </button>
                <button onClick={() => setIsHistoryOpen(true)} className="p-2 rounded-full text-white hover:bg-white/20 transition-colors" aria-label="Chat History">
                    <ClockIcon />
                </button>
            </div>
      </header>
      
      <HistoryPanel 
        isOpen={isHistoryOpen}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelect={handleSelectConversation}
        onDelete={handleDeleteConversation}
        onNewChat={handleNewChat}
        onClose={() => setIsHistoryOpen(false)}
      />
      
      {messages.length <= 1 && !isLoading ? (
        <div className="flex-grow flex items-center justify-center p-8 text-center">
            <p className="text-2xl text-brand-text font-sans">
                {messages[0]?.text || "Loading..."}
            </p>
        </div>
      ) : (
        <div className="flex-grow p-4 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl shadow-sm ${msg.sender === 'user' ? 'bg-user-bubble text-white rounded-br-none' : 'bg-ai-bubble text-brand-text rounded-bl-none'}`}>
                
                {msg.media && (
                  <div className="mb-2 rounded-lg overflow-hidden">
                    {msg.media.type === 'image' && <img src={msg.media.url} alt="User upload" className="max-w-full h-auto" />}
                    {msg.media.type === 'video' && <video src={msg.media.url} controls className="max-w-full h-auto" />}
                    {msg.media.type === 'audio' && <audio src={msg.media.url} controls className="w-full" />}
                  </div>
                )}
                
                <p className="whitespace-pre-wrap">{msg.text}</p>
                {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                    <h4 className="text-xs font-bold text-gray-500 mb-1">Sources:</h4>
                    <ul className="text-xs space-y-1">
                        {msg.sources.map((source, i) => (
                        <li key={i}>
                            {source.web?.uri ? (
                                <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-words">
                                {i + 1}. {source.web.title || source.web.uri}
                                </a>
                            ) : (
                                <span className="text-gray-500 break-words">
                                {i + 1}. {source.web?.title || 'Untitled Source'}
                                </span>
                            )}
                        </li>
                        ))}
                    </ul>
                    </div>
                )}
                </div>
            </div>
            ))}
            {isLoading && (
                <div className="flex justify-start">
                    <div className="max-w-xs px-4 py-3 rounded-2xl bg-ai-bubble text-brand-text rounded-bl-none shadow-sm">
                        <div className="flex items-center space-x-1">
                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
      )}

      <div className="p-4 border-t bg-white relative">
        {isMenuOpen && (
          <div className="absolute bottom-full left-4 mb-2 w-52 bg-white rounded-lg shadow-xl border overflow-hidden">
            <button onClick={() => fileInputRef.current?.click()} className="w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center text-gray-700">
              <PhotoIcon /> Tambah foto
            </button>
            <button onClick={() => cameraInputRef.current?.click()} className="w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center text-gray-700">
               <CameraIcon /> Ambil foto
            </button>
          </div>
        )}
        <div className="flex items-center space-x-2">
            <input type="file" ref={fileInputRef} onChange={handleMediaUpload} accept="image/*,video/*,audio/*" className="hidden" />
            <input type="file" ref={cameraInputRef} onChange={handleMediaUpload} accept="image/*,video/*" capture="environment" className="hidden" />

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-500 p-3 rounded-full hover:bg-gray-100 transition-colors" aria-label="Add media">
                <PlusIcon />
            </button>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(input)}
                placeholder="Ask Something..."
                className="flex-grow border rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                disabled={isLoading}
            />
            <button onClick={() => handleSendMessage(input)} className="bg-brand-primary text-white p-3 rounded-full hover:bg-teal-700 disabled:bg-gray-400 transition-colors" disabled={isLoading || (!input.trim() && !fileInputRef.current?.files?.length)}>
                <SendIcon />
            </button>
        </div>
      </div>
    </div>
  );
};

export default LearningPalPage;