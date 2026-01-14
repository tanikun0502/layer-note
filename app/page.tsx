'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import NotePage from '@/components/NotePage';
import { NotesProvider, useNotes } from '@/contexts/NotesContext';

function HomeContent() {
  const { addNote, setCurrentNoteId } = useNotes();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-notebook-cream">
      <Header
        onNewPage={handleNewPage}
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
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
