'use client';

import { FaPen, FaEraser, FaFont, FaImage } from 'react-icons/fa';

export type ToolType = 'pen' | 'eraser' | 'text' | 'image' | 'select';

interface ToolbarProps {
    currentTool: ToolType;
    onToolChange: (tool: ToolType) => void;
    onImageUpload: () => void;
    penColor: string;
    onPenColorChange: (color: string) => void;
}

const PEN_COLORS = [
    { name: '黒', color: '#2C2C2C' },
    { name: '赤', color: '#EF4444' },
    { name: '青', color: '#3B82F6' },
    { name: '蛍光黄', color: '#FACC15' },
    { name: '蛍光ピンク', color: '#F472B6' },
    { name: '蛍光緑', color: '#4ADE80' },
];

export default function Toolbar({ currentTool, onToolChange, onImageUpload, penColor, onPenColorChange }: ToolbarProps) {
    const tools = [
        { type: 'select' as ToolType, icon: '🖱️', label: '選択' },
        { type: 'pen' as ToolType, icon: <FaPen />, label: 'ペン' },
        { type: 'eraser' as ToolType, icon: <FaEraser />, label: '消しゴム' },
        { type: 'text' as ToolType, icon: <FaFont />, label: 'テキスト' },
    ];

    return (
        <div className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-2">
                {/* ツールボタン */}
                {tools.map((tool) => (
                    <button
                        key={tool.type}
                        onClick={() => onToolChange(tool.type)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${currentTool === tool.type
                            ? 'bg-teal-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        title={tool.label}
                    >
                        <span className="text-lg">{tool.icon}</span>
                        <span className="text-sm font-medium">{tool.label}</span>
                    </button>
                ))}

                {/* ペンカラー選択 */}
                {currentTool === 'pen' && (
                    <>
                        <div className="w-px h-8 bg-gray-300 mx-2" />
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 font-medium">色:</span>
                            {PEN_COLORS.map((colorOption) => (
                                <button
                                    key={colorOption.color}
                                    onClick={() => onPenColorChange(colorOption.color)}
                                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${penColor === colorOption.color
                                            ? 'border-teal-600 scale-110 shadow-md'
                                            : 'border-gray-300 hover:scale-105'
                                        }`}
                                    style={{ backgroundColor: colorOption.color }}
                                    title={colorOption.name}
                                />
                            ))}
                        </div>
                    </>
                )}

                {/* 区切り線 */}
                <div className="w-px h-8 bg-gray-300 mx-2" />

                {/* 画像アップロードボタン */}
                <button
                    onClick={onImageUpload}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                    <FaImage className="text-lg" />
                    <span className="text-sm font-medium">画像追加</span>
                </button>
            </div>
        </div>
    );
}
