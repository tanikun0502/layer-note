'use client';

import { useState, KeyboardEvent } from 'react';
import { FaTimes } from 'react-icons/fa';

interface TagInputProps {
    tags: string[];
    onAddTag: (tag: string) => void;
    onRemoveTag: (tag: string) => void;
}

// タグの色を生成（インデックスシール風）
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

export default function TagInput({ tags, onAddTag, onRemoveTag }: TagInputProps) {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            const newTag = inputValue.trim().startsWith('#')
                ? inputValue.trim()
                : `#${inputValue.trim()}`;

            if (!tags.includes(newTag)) {
                onAddTag(newTag);
            }
            setInputValue('');
        }
    };

    return (
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                タグ（Enterで追加）
            </label>

            {/* タグ表示 */}
            <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag) => (
                    <span
                        key={tag}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border-2 shadow-sm ${getTagColor(tag)}`}
                    >
                        {tag}
                        <button
                            onClick={() => onRemoveTag(tag)}
                            className="hover:opacity-70 transition-opacity"
                            aria-label={`${tag}を削除`}
                        >
                            <FaTimes className="text-xs" />
                        </button>
                    </span>
                ))}
            </div>

            {/* タグ入力欄 */}
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="タグを入力... (例: 数学, 重要)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
            />
        </div>
    );
}
