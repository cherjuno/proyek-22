import React, { useState, useRef } from 'react';
import { Page, LearnBoxSection, ContentItem } from '../types';
import PageHeader from '../components/PageHeader';
import useLocalStorage from '../hooks/useLocalStorage';
import { generateMindMap } from '../services/geminiService';

interface LearnBoxPageProps {
  setCurrentPage: (page: Page) => void;
}

const PlusIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>);
const SearchIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>);
const TrashIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>);
const ChevronDownIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>);
const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;
const FileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const MapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 13v-5.5m6 5.5v-5.5" /></svg>;

const initialSections: LearnBoxSection[] = [
    { id: '1', title: 'Physics', mindMap: '', content: [
        { type: 'text', id: 'c1', content: '- E = mc²\n- V = I × R' },
        { type: 'link', id: 'c2', url: 'https://youtu.be/Aq5WXmQQooo' }
    ]},
    { id: '2', title: 'Math', mindMap: '', content: [] }
];

const AddSectionModal: React.FC<{
  onClose: () => void;
  onAdd: (title: string) => void;
}> = ({ onClose, onAdd }) => {
    const [title, setTitle] = useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(title.trim()) {
            onAdd(title.trim());
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-4 text-brand-primary">Add New Section</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label htmlFor="section-title" className="block text-sm font-medium text-gray-700">Section Title</label>
                        <input
                        type="text"
                        id="section-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Chemistry"
                        className="mt-1 focus:ring-brand-primary focus:border-brand-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        autoFocus
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-brand-primary border border-transparent rounded-md shadow-sm hover:bg-teal-700">Add Section</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const LearnBoxPage: React.FC<LearnBoxPageProps> = ({ setCurrentPage }) => {
    const [sections, setSections] = useLocalStorage<LearnBoxSection[]>('learnbox-sections', initialSections);
    const [searchQuery, setSearchQuery] = useState('');
    const [openSectionId, setOpenSectionId] = useState<string | null>(sections[0]?.id || null);
    const [isGeneratingMap, setIsGeneratingMap] = useState<string | null>(null);
    const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const addSection = (title: string) => {
        const newSection: LearnBoxSection = { id: Date.now().toString(), title, content: [], mindMap: '' };
        setSections(prev => [...prev, newSection]);
        setOpenSectionId(newSection.id);
        setIsAddSectionModalOpen(false);
    };
    
    const addContent = (sectionId: string, type: ContentItem['type']) => {
        let newContent: ContentItem | null = null;
        if (type === 'text') {
            newContent = { type: 'text', id: Date.now().toString(), content: 'New note...' };
        } else if (type === 'link') {
            const url = prompt("Enter URL:");
            if (url) newContent = { type: 'link', id: Date.now().toString(), url };
        } else if (type === 'file' || type === 'image' || type === 'video') {
            fileInputRef.current?.click(); // We'll handle the result in the onChange
            return; // Exit early
        }

        if (newContent) {
            setSections(prev => prev.map(s => s.id === sectionId ? { ...s, content: [...s.content, newContent!] } : s));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, sectionId: string) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            let type: 'file' | 'image' | 'video' = 'file';
            if (file.type.startsWith('image/')) type = 'image';
            if (file.type.startsWith('video/')) type = 'video';
            const newContent: ContentItem = { type, id: Date.now().toString(), url, name: file.name };
            setSections(prev => prev.map(s => s.id === sectionId ? { ...s, content: [...s.content, newContent] } : s));
        }
    };
    
    // Fix: Changed updateContent to be type-safe by specifying it only updates text content and using a type guard.
    const updateContent = (sectionId: string, contentId: string, newText: string) => {
        setSections(prev => prev.map(s => s.id === sectionId ? {
            ...s,
            content: s.content.map(c => (c.id === contentId && c.type === 'text') ? { ...c, content: newText } : c)
        } : s));
    };

    const deleteContent = (sectionId: string, contentId: string) => {
        setSections(prev => prev.map(s => s.id === sectionId ? {
            ...s,
            content: s.content.filter(c => c.id !== contentId)
        } : s));
    };

    const handleGenerateMap = async (sectionId: string) => {
        const section = sections.find(s => s.id === sectionId);
        if (!section) return;
        setIsGeneratingMap(sectionId);
        const mindMap = await generateMindMap(section);
        setSections(prev => prev.map(s => s.id === sectionId ? { ...s, mindMap } : s));
        setIsGeneratingMap(null);
    };

    const clearMindMap = (sectionId: string) => {
        setSections(prev => prev.map(s => s.id === sectionId ? { ...s, mindMap: '' } : s));
    };


    const filteredSections = sections.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="flex flex-col h-full bg-brand-bg">
            <PageHeader title="Learn Box" onBack={() => setCurrentPage(Page.Home)} />
            <div className="p-4 flex-grow overflow-y-auto space-y-4">
                 <div className="relative">
                    <input type="text" placeholder="Search sections..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        className="w-full border p-3 pl-10 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary shadow-sm bg-white" />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><SearchIcon /></div>
                </div>

                {filteredSections.length > 0 ? filteredSections.map(section => (
                    <div key={section.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <button onClick={() => setOpenSectionId(openSectionId === section.id ? null : section.id)} className="w-full flex justify-between items-center p-4 bg-cyan-50 hover:bg-cyan-100">
                            <h3 className="font-bold text-lg text-brand-primary">{section.title}</h3>
                            <ChevronDownIcon />
                        </button>
                        {openSectionId === section.id && (
                            <div className="p-4 space-y-3">
                                {section.content.map(item => (
                                    <div key={item.id} className="p-2 rounded bg-gray-50 flex group items-start">
                                        <div className="flex-grow">
                                        {/* Fix: Updated the call to updateContent to pass a string instead of an object. */}
                                        {item.type === 'text' && <textarea value={item.content} onChange={e => updateContent(section.id, item.id, e.target.value)} className="w-full bg-transparent text-black focus:outline-none resize-none" rows={item.content.split('\n').length} />}
                                        {item.type === 'link' && <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all"><LinkIcon />{item.url}</a>}
                                        {item.type === 'file' && <div className="text-gray-700"><FileIcon />{item.name}</div>}
                                        {item.type === 'image' && <img src={item.url} alt="User content" className="max-w-full rounded-md" />}
                                        {item.type === 'video' && <video src={item.url} controls className="max-w-full rounded-md" />}
                                        </div>
                                        <button onClick={() => deleteContent(section.id, item.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 ml-2"><TrashIcon /></button>
                                    </div>
                                ))}
                                {section.mindMap && (
                                    <div className="mt-4 p-2 border-t">
                                        <h4 className="font-semibold mb-2">Mind Map:</h4>
                                        <pre className="bg-gray-800 text-white p-3 rounded-md text-xs overflow-x-auto"><code>{section.mindMap}</code></pre>
                                        <button onClick={() => clearMindMap(section.id)} className="text-xs text-red-500 mt-2">Clear Map</button>
                                    </div>
                                )}
                                <div className="border-t pt-3 flex items-center justify-between">
                                    <button onClick={() => handleGenerateMap(section.id)} disabled={isGeneratingMap === section.id} className="flex items-center text-sm font-semibold text-purple-600 hover:text-purple-800 disabled:opacity-50">
                                        {isGeneratingMap === section.id ? 'Generating...' : <><MapIcon /> Generate Mind Map</>}
                                    </button>
                                    <div className="flex gap-2">
                                        <button onClick={() => addContent(section.id, 'text')} className="text-xs bg-gray-200 px-2 py-1 rounded">Text</button>
                                        <button onClick={() => addContent(section.id, 'link')} className="text-xs bg-gray-200 px-2 py-1 rounded">Link</button>
                                        <button onClick={() => addContent(section.id, 'image')} className="text-xs bg-gray-200 px-2 py-1 rounded">Media</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )) : (
                    <p className="text-center text-gray-500 mt-8">No sections found. Start by creating one!</p>
                )}
            </div>
            <input type="file" ref={fileInputRef} onChange={(e) => openSectionId && handleFileChange(e, openSectionId)} className="hidden" accept="image/*,video/*,application/pdf" />
            <footer className="p-2 border-t bg-white">
                <button onClick={() => setIsAddSectionModalOpen(true)} className="w-full bg-brand-primary text-white font-semibold py-3 rounded-lg shadow-md hover:bg-teal-700 flex items-center justify-center">
                    <PlusIcon /> <span className="ml-2">Add New Section</span>
                </button>
            </footer>
            {isAddSectionModalOpen && <AddSectionModal onClose={() => setIsAddSectionModalOpen(false)} onAdd={addSection} />}
        </div>
    );
};

export default LearnBoxPage;