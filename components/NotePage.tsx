'use client';

import { useState } from 'react';
import Toolbar, { ToolType } from './Toolbar';
import CanvasEditor from './CanvasEditor';
import TagInput from './TagInput';
import { useNotes } from '@/contexts/NotesContext';

export default function NotePage() {
    const { notes, currentNoteId, updateNote, addTagToNote, removeTagFromNote } = useNotes();
    const [currentTool, setCurrentTool] = useState<ToolType>('select');
    const [imageUploadTrigger, setImageUploadTrigger] = useState(false);
    const [penColor, setPenColor] = useState('#2C2C2C'); // ペンの色

    const currentNote = notes.find(n => n.id === currentNoteId);

    if (!currentNote) {
        return (
            <div className="flex-1 flex items-center justify-center bg-notebook-cream">
                <p className="text-gray-500 italic">ノートが選択されていません</p>
            </div>
        );
    }

    const handleImageUpload = () => {
        setImageUploadTrigger(!imageUploadTrigger);
    };

    const handleTitleChange = (newTitle: string) => {
        updateNote(currentNote.id, { title: newTitle });
    };

    const handleAddTag = (tag: string) => {
        addTagToNote(currentNote.id, tag);
    };

    const handleRemoveTag = (tag: string) => {
        removeTagFromNote(currentNote.id, tag);
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            {/* ツールバー */}
            <Toolbar
                currentTool={currentTool}
                onToolChange={setCurrentTool}
                onImageUpload={handleImageUpload}
                penColor={penColor}
                onPenColorChange={setPenColor}
            />

            {/* ノートページコンテンツ */}
            <div className="flex-1 p-2 sm:p-8 overflow-y-auto">
                {/* ノートページコンテナ - 紙の立体感 */}
                <div className="max-w-4xl mx-auto bg-notebook-cream rounded-lg shadow-2xl p-4 sm:p-8 min-h-[calc(100vh-200px)] notebook-lines">
                    {/* タイトル入力 */}
                    <input
                        type="text"
                        value={currentNote.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="ページタイトルを入力..."
                        className="w-full text-2xl sm:text-3xl font-display bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 mb-4"
                    />

                    {/* タグ入力 */}
                    <TagInput
                        tags={currentNote.tags}
                        onAddTag={handleAddTag}
                        onRemoveTag={handleRemoveTag}
                    />

                    {/* キャンバスエディタ */}
                    <div className="flex justify-center mt-4 sm:mt-8">
                        <CanvasEditor
                            currentTool={currentTool}
                            onImageUploadTrigger={imageUploadTrigger}
                            noteId={currentNote.id}
                            canvasData={currentNote.canvasData}
                            onCanvasChange={(data) => updateNote(currentNote.id, { canvasData: data })}
                            penColor={penColor}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
