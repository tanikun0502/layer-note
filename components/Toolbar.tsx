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
        <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
            <div className="max-w-4xl mx-auto px-2 sm:px-4 py-2 sm:py-3 flex flex-wrap items-center gap-1 sm:gap-2">
                {/* ツールボタン */}
                <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                    {tools.map((tool) => (
                        <button
                            key={tool.type}
                            onClick={() => onToolChange(tool.type)}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-200 shrink-0 ${currentTool === tool.type
                                ? 'bg-teal-600 text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            title={tool.label}
                        >
                            <span className="text-base sm:text-lg">{tool.icon}</span>
                            <span className="text-xs sm:text-sm font-medium hidden xs:inline">{tool.label}</span>
                        </button>
                    ))}
                </div>

                {/* ペンカラー選択 */}
                {currentTool === 'pen' && (
                    <div className="flex items-center gap-1 sm:gap-2 bg-gray-50 p-1 sm:p-1.5 rounded-lg border border-gray-100">
                        <span className="text-[10px] sm:text-xs text-gray-500 font-bold ml-1 uppercase">Color:</span>
                        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
                            {PEN_COLORS.map((colorOption) => (
                                <button
                                    key={colorOption.color}
                                    onClick={() => onPenColorChange(colorOption.color)}
                                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 transition-all duration-200 shrink-0 ${penColor === colorOption.color
                                        ? 'border-teal-600 scale-110 shadow-md'
                                        : 'border-white hover:scale-105'
                                        }`}
                                    style={{ backgroundColor: colorOption.color }}
                                    title={colorOption.name}
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex-1" />

                {/* 画像アップロードボタン */}
                <button
                    onClick={onImageUpload}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-all duration-200 shadow-md hover:shadow-lg text-sm"
                >
                    <FaImage className="text-lg" />
                    <span className="font-medium hidden sm:inline">画像追加</span>
                    <span className="font-medium inline sm:hidden">+</span>
                </button>
            </div>
        </div>
    );
}
