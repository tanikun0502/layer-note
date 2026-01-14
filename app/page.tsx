'use client';

import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import NotePage from '@/components/NotePage';
import { NotesProvider, useNotes } from '@/contexts/NotesContext';

function HomeContent() {
  const { addNote, setCurrentNoteId } = useNotes();

  const handleNewPage = () => {
    const newId = Date.now().toString();
    const newNote = {
      id: newId,
      title: '新しいページ',
      tags: [],
      canvasData: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    addNote(newNote);
    setCurrentNoteId(newId);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header onNewPage={handleNewPage} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <NotePage />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <NotesProvider>
      <HomeContent />
    </NotesProvider>
  );
}
