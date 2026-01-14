'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Note {
    id: string;
    title: string;
    tags: string[];
    canvasData: string;
    createdAt: Date;
    updatedAt: Date;
}

interface NotesContextType {
    notes: Note[];
    currentNoteId: string | null;
    selectedTags: string[];
    addNote: (note: Note) => void;
    updateNote: (id: string, updates: Partial<Note>) => void;
    deleteNote: (id: string) => void;
    reorderNotes: (newNotes: Note[]) => void;
    setCurrentNoteId: (id: string | null) => void;
    addTagToNote: (noteId: string, tag: string) => void;
    removeTagFromNote: (noteId: string, tag: string) => void;
    toggleTagFilter: (tag: string) => void;
    clearTagFilters: () => void;
    getAllTags: () => string[];
    getFilteredNotes: () => Note[];
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

const STORAGE_KEY = 'layernote-data';

export function NotesProvider({ children }: { children: ReactNode }) {
    const [notes, setNotes] = useState<Note[]>([]);
    const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // 初期読み込み
    useEffect(() => {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                // Date型を復元
                const restoredNotes = parsedData.notes.map((note: any) => ({
                    ...note,
                    createdAt: new Date(note.createdAt),
                    updatedAt: new Date(note.updatedAt)
                }));
                setNotes(restoredNotes);
                setCurrentNoteId(parsedData.currentNoteId || (restoredNotes.length > 0 ? restoredNotes[0].id : null));
            } catch (error) {
                console.error('Failed to load notes from localStorage:', error);
            }
        } else {
            // データがない場合は初期ノートを作成
            const initialNote: Note = {
                id: '1',
                title: 'はじめてのノート',
                tags: [],
                canvasData: '',
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            setNotes([initialNote]);
            setCurrentNoteId('1');
        }
        setIsInitialized(true);
    }, []);

    // データの保存
    useEffect(() => {
        if (!isInitialized) return;

        const dataToSave = {
            notes,
            currentNoteId
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    }, [notes, currentNoteId, isInitialized]);

    const addNote = (note: Note) => {
        setNotes([...notes, note]);
    };

    const updateNote = (id: string, updates: Partial<Note>) => {
        setNotes(notes.map(note =>
            note.id === id ? { ...note, ...updates, updatedAt: new Date() } : note
        ));
    };

    const deleteNote = (id: string) => {
        const newNotes = notes.filter(note => note.id !== id);
        setNotes(newNotes);
        if (currentNoteId === id) {
            setCurrentNoteId(newNotes.length > 0 ? newNotes[0].id : null);
        }
    };

    const reorderNotes = (newNotes: Note[]) => {
        setNotes(newNotes);
    };

    const addTagToNote = (noteId: string, tag: string) => {
        setNotes(notes.map(note => {
            if (note.id === noteId && !note.tags.includes(tag)) {
                return { ...note, tags: [...note.tags, tag], updatedAt: new Date() };
            }
            return note;
        }));
    };

    const removeTagFromNote = (noteId: string, tag: string) => {
        setNotes(notes.map(note => {
            if (note.id === noteId) {
                return { ...note, tags: note.tags.filter(t => t !== tag), updatedAt: new Date() };
            }
            return note;
        }));
    };

    const toggleTagFilter = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const clearTagFilters = () => {
        setSelectedTags([]);
    };

    const getAllTags = () => {
        const tagSet = new Set<string>();
        notes.forEach(note => {
            note.tags.forEach(tag => tagSet.add(tag));
        });
        return Array.from(tagSet).sort();
    };

    const getFilteredNotes = () => {
        if (selectedTags.length === 0) {
            return notes;
        }
        return notes.filter(note =>
            selectedTags.some(tag => note.tags.includes(tag))
        );
    };

    return (
        <NotesContext.Provider
            value={{
                notes,
                currentNoteId,
                selectedTags,
                addNote,
                updateNote,
                deleteNote,
                reorderNotes,
                setCurrentNoteId,
                addTagToNote,
                removeTagFromNote,
                toggleTagFilter,
                clearTagFilters,
                getAllTags,
                getFilteredNotes,
            }}
        >
            {children}
        </NotesContext.Provider>
    );
}

export function useNotes() {
    const context = useContext(NotesContext);
    if (context === undefined) {
        throw new Error('useNotes must be used within a NotesProvider');
    }
    return context;
}
