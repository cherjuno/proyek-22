import React, { useState, useMemo } from 'react';
import { Page, Scribble, ScribbleNote } from '../types';
import PageHeader from '../components/PageHeader';
import useLocalStorage from '../hooks/useLocalStorage';

interface QuickScribblePageProps {
  setCurrentPage: (page: Page) => void;
}

const initialScribbles: Scribble[] = [
    {
        id: '1',
        name: 'Physics',
        notes: [
            { type: 'text', id: 'p1', content: 'E = mc²' },
            { type: 'text', id: 'p2', content: 'V = I × R' },
            { type: 'text', id: 'p3', content: 'Rt = R1 + R2 + R3' },
        ],
    },
    { id: '2', name: 'Math', notes: [{ type: 'text', id: 'm1', content: 'a² + b² = c²' }] },
    { id: '3', name: 'Geography', notes: [] },
    { id: '4', name: 'English', notes: [] },
];

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const PlusIcon = ({ className = "h-8 w-8" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
);

const BackArrowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const LinkIcon = ({ className = "h-5 w-5 text-gray-500 flex-shrink-0" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
);


const SubjectEditor: React.FC<{
    subject: Scribble;
    onUpdate: (subject: Scribble) => void;
    onDelete: (subjectId: string) => void;
    onBack: () => void;
}> = ({ subject, onUpdate, onDelete, onBack }) => {
    
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({ ...subject, name: e.target.value });
    };

    const handleNoteUpdate = (updatedNote: ScribbleNote) => {
        const updatedNotes = subject.notes.map(note =>
            note.id === updatedNote.id ? updatedNote : note
        );
        onUpdate({ ...subject, notes: updatedNotes });
    };
    
    const addTextNote = () => {
        const newNote: ScribbleNote = { type: 'text', id: Date.now().toString(), content: '' };
        onUpdate({ ...subject, notes: [...subject.notes, newNote] });
    };

    const addLinkNote = () => {
        const url = prompt("Enter the URL:");
        if (url) {
            const newNote: ScribbleNote = { type: 'link', id: Date.now().toString(), url };
            onUpdate({ ...subject, notes: [...subject.notes, newNote] });
        }
    };


    const deleteNote = (noteId: string) => {
        const updatedNotes = subject.notes.filter(note => note.id !== noteId);
        onUpdate({ ...subject, notes: updatedNotes });
    };

    return (
        <div className="p-6 flex flex-col h-full">
            <div className="flex items-center mb-6 flex-shrink-0">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-200 transition-colors">
                    <BackArrowIcon />
                </button>
                <input 
                    type="text" 
                    value={subject.name}
                    onChange={handleNameChange}
                    className="text-2xl font-bold text-brand-text bg-transparent border-b-2 border-transparent focus:border-brand-primary focus:outline-none flex-grow ml-2"
                />
            </div>
            <div className="flex-grow space-y-3 overflow-y-auto">
                {subject.notes.map(note => (
                    <div key={note.id} className="flex items-center group">
                        {note.type === 'text' ? (
                            <textarea
                                value={note.content}
                                onChange={(e) => handleNoteUpdate({ ...note, content: e.target.value })}
                                placeholder="Start making something..."
                                className="w-full p-3 bg-gray-50 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary transition resize-none"
                                rows={Math.max(1, note.content.split('\n').length)}
                            />
                        ) : (
                             <div className="w-full flex items-center p-3 bg-gray-50 rounded-lg">
                                <LinkIcon />
                                <input
                                    type="url"
                                    value={note.url}
                                    onChange={(e) => handleNoteUpdate({ ...note, url: e.target.value })}
                                    placeholder="Enter URL"
                                    className="w-full bg-transparent text-blue-600 focus:outline-none ml-2"
                                />
                            </div>
                        )}
                         <button onClick={() => deleteNote(note.id)} className="ml-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                            <TrashIcon />
                        </button>
                    </div>
                ))}
                <div className="border-t-2 border-dashed border-gray-300 pt-3 flex gap-2">
                     <button onClick={addTextNote} className="w-full bg-cyan-100 text-cyan-800 font-semibold py-3 rounded-lg hover:bg-cyan-200 transition-colors flex items-center justify-center">
                        <PlusIcon className="h-6 w-6 mr-2" /> Add Text
                    </button>
                    <button onClick={addLinkNote} className="w-full bg-blue-100 text-blue-800 font-semibold py-3 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center">
                        <LinkIcon className="h-5 w-5 mr-2 text-blue-800" /> Add Link
                    </button>
                </div>
            </div>
            <div className="mt-6 flex-shrink-0">
                 <button onClick={() => { if(window.confirm(`Are you sure you want to delete the subject "${subject.name}"?`)) onDelete(subject.id) }} className="w-full bg-red-500 text-white font-semibold py-3 rounded-lg hover:bg-red-600 transition-all shadow-md">
                    Delete Subject
                </button>
            </div>
        </div>
    );
};


const AddSubjectModal: React.FC<{
  onClose: () => void;
  onAdd: (name: string) => void;
}> = ({ onClose, onAdd }) => {
    const [name, setName] = useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(name.trim()) {
            onAdd(name.trim());
        }
    }
    return (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-4 text-brand-primary">Add New Subject</h3>
                <form onSubmit={handleSubmit}>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Subject Name"
                        className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary" autoFocus />
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-brand-primary border border-transparent rounded-md shadow-sm hover:bg-teal-700">Add</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

const QuickScribblePage: React.FC<QuickScribblePageProps> = ({ setCurrentPage }) => {
  const [subjects, setSubjects] = useLocalStorage<Scribble[]>('scribbles', initialScribbles);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredSubjects = useMemo(() => {
    if (!searchQuery) return subjects;
    const lowerCaseQuery = searchQuery.toLowerCase();
    return subjects.filter(subject =>
      subject.name.toLowerCase().includes(lowerCaseQuery) ||
      subject.notes.some(note => {
        if (note.type === 'text') {
            return note.content.toLowerCase().includes(lowerCaseQuery)
        }
        if (note.type === 'link') {
            return note.url.toLowerCase().includes(lowerCaseQuery)
        }
        return false;
      })
    );
  }, [subjects, searchQuery]);
  
  const addSubject = (name: string) => {
      const newSubject: Scribble = {
          id: Date.now().toString(),
          name,
          notes: []
      };
      setSubjects([...subjects, newSubject]);
      setIsAddModalOpen(false);
  };
  
  const updateSubject = (updatedSubject: Scribble) => {
    setSubjects(subjects.map(s => s.id === updatedSubject.id ? updatedSubject : s));
  };
  
  const deleteSubject = (subjectId: string) => {
    setSubjects(subjects.filter(s => s.id !== subjectId));
    setActiveSubjectId(null);
  }

  const activeSubject = subjects.find(s => s.id === activeSubjectId);

  if (activeSubject) {
      return <SubjectEditor 
        subject={activeSubject}
        onUpdate={updateSubject}
        onDelete={deleteSubject}
        onBack={() => setActiveSubjectId(null)}
      />
  }

  return (
    <div className="flex flex-col h-full bg-brand-bg">
      <PageHeader title="Quick Scribble" onBack={() => setCurrentPage(Page.Home)} />
      <div className="p-6 flex-grow flex flex-col space-y-6">
        <div className="relative flex-shrink-0">
          <input
            type="text"
            placeholder="Search in scribbles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border bg-white p-3 pl-10 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary shadow-sm"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchIcon />
          </div>
        </div>
        
        <div className="flex-grow overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
                {filteredSubjects.map(subject => (
                    <button key={subject.id} onClick={() => setActiveSubjectId(subject.id)} className="bg-cyan-50 hover:bg-cyan-100 transition-colors p-4 rounded-lg shadow-sm text-left h-36 flex flex-col">
                        <h3 className="font-bold text-cyan-800 text-lg mb-2 flex-shrink-0">{subject.name}</h3>
                        <div className="text-xs text-black space-y-1 overflow-hidden">
                           {subject.notes.slice(0, 3).map(note => (
                               <p key={note.id} className="truncate">
                                {note.type === 'text' ? (note.content || "...") : note.url}
                               </p>
                           ))}
                           {subject.notes.length === 0 && <p className="italic">No notes yet.</p>}
                        </div>
                    </button>
                ))}
                 <button onClick={() => setIsAddModalOpen(true)} className="border-2 border-dashed border-gray-300 hover:bg-gray-100 transition-colors p-4 rounded-lg shadow-sm flex items-center justify-center h-36 flex-col text-gray-500">
                    <PlusIcon />
                    <span className="mt-2 font-semibold">Add Subject</span>
                 </button>
            </div>
        </div>
      </div>
      {isAddModalOpen && <AddSubjectModal onClose={() => setIsAddModalOpen(false)} onAdd={addSubject} />}
    </div>
  );
};

export default QuickScribblePage;