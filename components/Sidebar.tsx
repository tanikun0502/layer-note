'use client';

import { useNotes, Note } from '@/contexts/NotesContext';
import { FaTrash, FaChevronUp, FaChevronDown, FaTimes } from 'react-icons/fa';

// タグの色を生成（TagInputと同じロジック）
const TAG_COLORS = [
    'bg-pink-200 text-pink-800 border-pink-300',
    'bg-blue-200 text-blue-800 border-blue-300',
    'bg-green-200 text-green-800 border-green-300',
    'bg-yellow-200 text-yellow-800 border-yellow-300',
    'bg-purple-200 text-purple-800 border-purple-300',
    'bg-orange-200 text-orange-800 border-orange-300',
    'bg-teal-200 text-teal-800 border-teal-300',
    'bg-red-200 text-red-800 border-red-300',
];

function getTagColor(tag: string): string {
    const index = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return TAG_COLORS[index % TAG_COLORS.length];
}

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const {
        notes,
        getFilteredNotes,
        currentNoteId,
        setCurrentNoteId,
        getAllTags,
        selectedTags,
        toggleTagFilter,
        clearTagFilters,
        deleteNote,
        reorderNotes,
    } = useNotes();

    const pages = getFilteredNotes();
    const allTags = getAllTags();

    const handlePageClick = (id: string) => {
        setCurrentNoteId(id);
        if (window.innerWidth < 1024) { // モバイル時はクリック後に閉じる
            onClose();
        }
    };

    const handleDelete = (e: React.MouseEvent, id: string, title: string) => {
        e.stopPropagation();
        if (window.confirm(`「${title || '無題のページ'}」を削除してもよろしいですか？`)) {
            deleteNote(id);
        }
    };

    const moveNote = (e: React.MouseEvent, index: number, direction: 'up' | 'down') => {
        e.stopPropagation();
        const newNotes = [...notes];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex >= 0 && targetIndex < newNotes.length) {
            [newNotes[index], newNotes[targetIndex]] = [newNotes[targetIndex], newNotes[index]];
            reorderNotes(newNotes);
        }
    };

    return (
        <>
            {/* モバイル用オーバーレイ */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity"
                    onClick={onClose}
                />
            )}

            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-pastel-teal text-gray-800 h-screen overflow-y-auto shadow-2xl flex flex-col transition-transform duration-300 transform
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:relative lg:translate-x-0 lg:z-0
            `}>
                {/* サイドバーヘッダー */}
                <div className="p-6 border-b border-teal-300 shrink-0 flex items-center justify-between">
                    <h2 className="text-xl font-display text-teal-700">目次</h2>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 hover:bg-teal-200 rounded-full transition-colors"
                    >
                        <FaTimes className="text-teal-700" />
                    </button>
                </div>

                {/* ページリスト */}
                <nav className="flex-1 overflow-y-auto p-4">
                    {pages.length === 0 ? (
                        <p className="text-gray-600 text-sm italic px-2">
                            {selectedTags.length > 0 ? 'タグに一致するページがありません' : 'ページがありません'}
                        </p>
                    ) : (
                        <ul className="space-y-2">
                            {pages.map((page, displayedIndex) => {
                                // 元のnotes配列でのインデックスを取得（並び替え用）
                                const originalIndex = notes.findIndex(n => n.id === page.id);

                                return (
                                    <li key={page.id} className="group relative">
                                        <button
                                            onClick={() => handlePageClick(page.id)}
                                            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 pr-10 ${currentNoteId === page.id
                                                ? 'bg-teal-600 text-white shadow-md'
                                                : 'hover:bg-teal-200 text-gray-700 hover:text-gray-900'
                                                }`}
                                        >
                                            <span className="block truncate font-medium pr-8">{page.title || '無題のページ'}</span>
                                            {page.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {page.tags.slice(0, 3).map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="text-xs px-2 py-0.5 bg-white bg-opacity-30 rounded-full"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                    {page.tags.length > 3 && (
                                                        <span className="text-xs px-2 py-0.5 bg-white bg-opacity-30 rounded-full">
                                                            +{page.tags.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </button>

                                        {/* 操作ボタン（ホバー時に表示） */}
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {selectedTags.length === 0 && (
                                                <>
                                                    {originalIndex > 0 && (
                                                        <button
                                                            onClick={(e) => moveNote(e, originalIndex, 'up')}
                                                            className="p-1 hover:bg-teal-300 rounded text-teal-700 transition-colors"
                                                            title="上へ移動"
                                                        >
                                                            <FaChevronUp size={12} />
                                                        </button>
                                                    )}
                                                    {originalIndex < notes.length - 1 && (
                                                        <button
                                                            onClick={(e) => moveNote(e, originalIndex, 'down')}
                                                            className="p-1 hover:bg-teal-300 rounded text-teal-700 transition-colors"
                                                            title="下へ移動"
                                                        >
                                                            <FaChevronDown size={12} />
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                            <button
                                                onClick={(e) => handleDelete(e, page.id, page.title)}
                                                className="p-1 hover:bg-red-200 rounded text-red-500 transition-colors"
                                                title="削除"
                                            >
                                                <FaTrash size={12} />
                                            </button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </nav>

                {/* タグセクション */}
                <div className="p-6 border-t border-teal-300 mt-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-display text-teal-700">タグ</h3>
                        {selectedTags.length > 0 && (
                            <button
                                onClick={clearTagFilters}
                                className="text-xs text-teal-600 hover:text-teal-800 underline"
                            >
                                クリア
                            </button>
                        )}
                    </div>

                    {allTags.length === 0 ? (
                        <p className="text-gray-600 text-sm italic">
                            タグがありません
                        </p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {allTags.map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => toggleTagFilter(tag)}
                                    className={`px-3 py-1 rounded-full text-sm font-medium border-2 transition-all duration-200 ${selectedTags.includes(tag)
                                        ? 'ring-2 ring-teal-500 ring-offset-2'
                                        : ''
                                        } ${getTagColor(tag)}`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
}

