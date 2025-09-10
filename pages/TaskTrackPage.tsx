import React, { useState } from 'react';
import { Page, Task, WeeklySchedule, DayOfWeek } from '../types';
import PageHeader from '../components/PageHeader';
import useLocalStorage from '../hooks/useLocalStorage';

interface TaskTrackPageProps {
  setCurrentPage: (page: Page) => void;
}

const PlusIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const initialSchedule: WeeklySchedule = { Sunday: [], Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [] };
const daysOfWeek: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const AddSubjectModal: React.FC<{
  onClose: () => void;
  onAddSubject: (day: DayOfWeek, name: string) => void;
}> = ({ onClose, onAddSubject }) => {
  const [day, setDay] = useState<DayOfWeek>('Sunday');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddSubject(day, name.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-bold mb-4 text-brand-primary">Add Subject</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="day-select" className="block text-sm font-medium text-gray-700">Day of the Week</label>
            <select
              id="day-select"
              value={day}
              onChange={(e) => setDay(e.target.value as DayOfWeek)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md"
            >
              {daysOfWeek.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="subject-name" className="block text-sm font-medium text-gray-700">Subject Name</label>
            <input
              type="text"
              id="subject-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Physics"
              className="mt-1 focus:ring-brand-primary focus:border-brand-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-brand-primary border border-transparent rounded-md shadow-sm hover:bg-teal-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};


const TaskTrackPage: React.FC<TaskTrackPageProps> = ({ setCurrentPage }) => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [schedule, setSchedule] = useLocalStorage<WeeklySchedule>('schedule', initialSchedule);
  const [newTask, setNewTask] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addTask = () => {
    if (newTask.trim() !== '') {
      setTasks([...tasks, { id: Date.now().toString(), text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };
  
  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  }
  
  const addSubject = (day: DayOfWeek, subjectName: string) => {
    const newSubject = { id: Date.now().toString(), name: subjectName };
    setSchedule(prev => ({
      ...prev,
      [day]: [...prev[day], newSubject]
    }));
    setIsModalOpen(false);
  };

  const deleteSubject = (day: DayOfWeek, subjectId: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: prev[day].filter(s => s.id !== subjectId)
    }));
  };

  const filteredTasks = tasks.filter(task => task.text.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex flex-col h-full bg-brand-bg">
      <PageHeader title="Task Track" />
      <div className="p-6 flex-grow overflow-y-auto space-y-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search tasks or subjects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchIcon />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-brand-primary mb-4">Daily Quest</h2>
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTask()}
                    placeholder="Add a new quest..."
                    className="flex-grow border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
                <button onClick={addTask} className="bg-brand-primary text-white p-2 rounded-full hover:bg-teal-700 transition-colors flex-shrink-0">
                    <PlusIcon />
                </button>
            </div>
            <ul className="space-y-3">
              {filteredTasks.map((task, index) => (
                <li key={task.id} className={`flex items-center group p-3 rounded-lg transition-all ${task.completed ? 'bg-green-50' : 'bg-white'}`}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="form-checkbox h-6 w-6 rounded-full border-gray-300 text-green-500 focus:ring-green-400 transition-colors flex-shrink-0 cursor-pointer"
                  />
                  <span className={`ml-3 text-lg flex-grow ${task.completed ? 'line-through text-gray-400' : 'text-brand-text'}`}>
                    <span className="font-bold mr-2">{index + 1}.</span>
                    {task.text}
                  </span>
                  <button onClick={() => deleteTask(task.id)} className="ml-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <TrashIcon />
                  </button>
                </li>
              ))}
              {tasks.length === 0 && <p className="text-gray-500 text-center py-4">No quests for today. Add one!</p>}
            </ul>
        </div>
        
        <div className="relative">
          <h2 className="text-xl font-bold text-brand-text mb-4">School/Learning Subjects Schedule</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {daysOfWeek.map(day => (
              <div key={day} className="bg-gray-50 p-3 rounded-lg shadow-sm">
                <h3 className="font-bold text-brand-primary">{day}</h3>
                <ul className="mt-2 space-y-2 text-sm">
                  {schedule[day]
                    .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(subject => (
                      <li key={subject.id} className="flex justify-between items-center bg-white p-2 rounded shadow-xs group">
                        <span className="text-black">{subject.name}</span>
                        <button onClick={() => deleteSubject(day, subject.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100">
                          <TrashIcon />
                        </button>
                      </li>
                  ))}
                  {schedule[day].length === 0 && <p className="text-xs text-gray-400">No subjects.</p>}
                </ul>
              </div>
            ))}
          </div>
          <button onClick={() => setIsModalOpen(true)} className="absolute -bottom-4 -right-4 bg-brand-primary text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-teal-700 transition-transform transform hover:scale-110">
            <PlusIcon className="h-8 w-8"/>
          </button>
        </div>
      </div>
      {isModalOpen && <AddSubjectModal onClose={() => setIsModalOpen(false)} onAddSubject={addSubject} />}
    </div>
  );
};

export default TaskTrackPage;