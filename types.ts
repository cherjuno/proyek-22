// Fix: Populated the file with type definitions used across the application.
export enum Page {
  Login,
  Home,
  LearningPal,
  TaskTrack,
  LearnBox,
  QuickScribble,
  MapIt,
}

export interface Media {
  type: 'image' | 'video' | 'audio';
  url: string; // data URL
  mimeType: string;
}

export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  media?: Media;
  sources?: GroundingChunk[];
}

export interface Conversation {
  id: string;
  startTime: number;
  messages: ChatMessage[];
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export interface Subject {
  id: string;
  name: string;
}

export type DayOfWeek = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export type WeeklySchedule = {
  [key in DayOfWeek]: Subject[];
};

export type ScribbleNote = 
    | { type: 'text'; id: string; content: string }
    | { type: 'link'; id: string; url: string };

export interface Scribble {
  id: string;
  name: string;
  notes: ScribbleNote[];
}

export type ContentItem = 
    | { type: 'text'; id: string; content: string }
    | { type: 'link'; id: string; url: string }
    | { type: 'file'; id: string; name: string; url: string }
    | { type: 'video'; id: string; url: string }
    | { type: 'image'; id: string; url: string };

export interface LearnBoxSection {
    id: string;
    title: string;
    content: ContentItem[];
    mindMap?: string;
}

export interface Deck {
  id: string;
  name: string;
  cards: Flashcard[];
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
}