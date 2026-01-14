'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas, PencilBrush, IText, FabricImage } from 'fabric';
import { ToolType } from './Toolbar';

interface CanvasEditorProps {
    currentTool: ToolType;
    onImageUploadTrigger: boolean;
    noteId: string; // ページIDを追加
    canvasData: string; // キャンバスデータを追加
    onCanvasChange?: (data: string) => void; // キャンバス変更時のコールバック
    penColor: string; // ペンの色
}

export default function CanvasEditor({ currentTool, onImageUploadTrigger, noteId, canvasData, onCanvasChange, penColor }: CanvasEditorProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricCanvasRef = useRef<Canvas | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    // Undo/Redo用の履歴管理
    const historyRef = useRef<string[]>([]);
    const historyIndexRef = useRef<number>(-1);
    const isUndoRedoRef = useRef<boolean>(false);

    // Fabric.jsキャンバスの初期化
    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = new Canvas(canvasRef.current, {
            width: 800,
            height: 600,
            backgroundColor: 'transparent',
        });

        fabricCanvasRef.current = canvas;

        return () => {
            canvas.dispose();
        };
    }, []);

    // ページ切り替え時にキャンバスをクリアして新しいデータを読み込む
    useEffect(() => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        // キャンバスをクリア
        canvas.clear();
        canvas.backgroundColor = 'transparent';

        // 履歴をリセット
        historyRef.current = [];
        historyIndexRef.current = -1;

        // 保存されたデータがあれば復元
        if (canvasData) {
            try {
                canvas.loadFromJSON(canvasData).then(() => {
                    canvas.renderAll();
                    // 初期状態を履歴に追加
                    saveHistory();
                });
            } catch (error) {
                console.error('Failed to load canvas data:', error);
            }
        } else {
            // 空のキャンバスの状態を履歴に追加
            saveHistory();
        }
    }, [noteId, canvasData]); // noteIdが変わったときに実行

    // 履歴を保存する関数
    const saveHistory = () => {
        const canvas = fabricCanvasRef.current;
        if (!canvas || isUndoRedoRef.current) return;

        const json = JSON.stringify(canvas.toJSON());

        // 現在のインデックス以降の履歴を削除
        historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);

        // 新しい状態を追加
        historyRef.current.push(json);
        historyIndexRef.current = historyRef.current.length - 1;

        // 履歴が多すぎる場合は古いものを削除（最大50件）
        if (historyRef.current.length > 50) {
            historyRef.current.shift();
            historyIndexRef.current--;
        }
    };

    // キャンバスの変更を監視して保存
    useEffect(() => {
        const canvas = fabricCanvasRef.current;
        if (!canvas || !onCanvasChange) return;

        const handleCanvasModified = () => {
            const json = JSON.stringify(canvas.toJSON());
            onCanvasChange(json);
            saveHistory(); // 履歴に保存
        };

        canvas.on('object:added', handleCanvasModified);
        canvas.on('object:modified', handleCanvasModified);
        canvas.on('object:removed', handleCanvasModified);

        return () => {
            canvas.off('object:added', handleCanvasModified);
            canvas.off('object:modified', handleCanvasModified);
            canvas.off('object:removed', handleCanvasModified);
        };
    }, [onCanvasChange]);

    // Undo機能
    const undo = () => {
        const canvas = fabricCanvasRef.current;
        if (!canvas || historyIndexRef.current <= 0) return;

        isUndoRedoRef.current = true;
        historyIndexRef.current--;

        const state = historyRef.current[historyIndexRef.current];
        canvas.loadFromJSON(state).then(() => {
            canvas.renderAll();
            isUndoRedoRef.current = false;

            // 状態をContextに保存
            if (onCanvasChange) {
                onCanvasChange(state);
            }
        });
    };

    // Redo機能
    const redo = () => {
        const canvas = fabricCanvasRef.current;
        if (!canvas || historyIndexRef.current >= historyRef.current.length - 1) return;

        isUndoRedoRef.current = true;
        historyIndexRef.current++;

        const state = historyRef.current[historyIndexRef.current];
        canvas.loadFromJSON(state).then(() => {
            canvas.renderAll();
            isUndoRedoRef.current = false;

            // 状態をContextに保存
            if (onCanvasChange) {
                onCanvasChange(state);
            }
        });
    };

    // キーボードショートカット（Cmd+Z / Ctrl+Z for Undo, Cmd+Shift+Z / Ctrl+Shift+Z for Redo）
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const canvas = fabricCanvasRef.current;
            if (!canvas) return;

            // テキスト編集中は何もしない
            const activeObject = canvas.getActiveObject();
            if (activeObject && (activeObject as any).isEditing) {
                return;
            }

            // Cmd+Z (Mac) または Ctrl+Z (Windows/Linux)
            if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                undo();
            }
            // Cmd+Shift+Z (Mac) または Ctrl+Shift+Z (Windows/Linux)
            else if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) {
                e.preventDefault();
                redo();
            }
            // Cmd+Y (Mac) または Ctrl+Y (Windows/Linux) - 別のRedoショートカット
            else if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
                e.preventDefault();
                redo();
            }
            // Delete または Backspace で選択したオブジェクトを削除
            else if (e.key === 'Delete' || e.key === 'Backspace') {
                const activeObjects = canvas.getActiveObjects();
                if (activeObjects.length > 0) {
                    e.preventDefault();
                    activeObjects.forEach(obj => canvas.remove(obj));
                    canvas.discardActiveObject();
                    canvas.renderAll();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []); // 空の依存配列でマウント時のみ実行

    // ツール変更時の処理
    useEffect(() => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        // すべてのモードをリセット
        canvas.isDrawingMode = false;
        canvas.selection = false;

        switch (currentTool) {
            case 'select':
                canvas.selection = true;
                canvas.defaultCursor = 'default';
                break;

            case 'pen':
                canvas.isDrawingMode = true;
                const brush = new PencilBrush(canvas);
                brush.color = penColor; // 選択された色を使用
                brush.width = 3;
                canvas.freeDrawingBrush = brush;
                break;

            case 'eraser':
                // 消しゴムモード: オブジェクトをクリックして削除
                canvas.selection = true;
                canvas.defaultCursor = 'crosshair';
                break;

            case 'text':
                canvas.defaultCursor = 'text';
                // テキストモードはクリック時に処理
                break;

            default:
                break;
        }
    }, [currentTool, penColor]); // penColorも監視

    // 消しゴムモード: オブジェクトクリックで削除
    useEffect(() => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        const handleObjectClick = (e: any) => {
            if (currentTool !== 'eraser') return;

            const target = e.target;
            if (target) {
                canvas.remove(target);
                canvas.renderAll();
            }
        };

        canvas.on('mouse:down', handleObjectClick);

        return () => {
            canvas.off('mouse:down', handleObjectClick);
        };
    }, [currentTool]);

    // テキスト追加（キャンバスクリック時）
    useEffect(() => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        const handleCanvasClick = (e: any) => {
            if (currentTool !== 'text') return;
            if (e.target) return; // オブジェクトをクリックした場合は何もしない

            const pointer = canvas.getScenePoint(e.e);
            const text = new IText('テキストを入力', {
                left: pointer.x,
                top: pointer.y,
                fontSize: 20,
                fill: '#2C2C2C',
                fontFamily: 'Arial',
            });

            canvas.add(text);
            canvas.setActiveObject(text);
            text.enterEditing();
        };

        canvas.on('mouse:down', handleCanvasClick);

        return () => {
            canvas.off('mouse:down', handleCanvasClick);
        };
    }, [currentTool]);

    // 画像アップロード処理
    useEffect(() => {
        if (onImageUploadTrigger && fileInputRef.current) {
            fileInputRef.current.click();
        }
    }, [onImageUploadTrigger]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const canvas = fabricCanvasRef.current;
        if (!canvas || !e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            const imgUrl = event.target?.result as string;

            FabricImage.fromURL(imgUrl).then((img) => {
                // 画像のサイズを調整
                const maxWidth = 400;
                const maxHeight = 400;
                const scale = Math.min(maxWidth / (img.width || 1), maxHeight / (img.height || 1), 1);

                img.scale(scale);
                img.set({
                    left: 100,
                    top: 100,
                });

                // 画像を最背面に配置
                canvas.add(img);
                canvas.sendObjectToBack(img);
                canvas.renderAll();
            });
        };

        reader.readAsDataURL(file);

        // inputをリセット（同じファイルを再度選択できるように）
        e.target.value = '';
    };

    // ドラッグ&ドロップ処理
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        const file = e.dataTransfer.files[0];
        if (!file || !file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const imgUrl = event.target?.result as string;

            FabricImage.fromURL(imgUrl).then((img) => {
                const maxWidth = 400;
                const maxHeight = 400;
                const scale = Math.min(maxWidth / (img.width || 1), maxHeight / (img.height || 1), 1);

                img.scale(scale);
                img.set({
                    left: e.nativeEvent.offsetX - (img.width! * scale) / 2,
                    top: e.nativeEvent.offsetY - (img.height! * scale) / 2,
                });

                canvas.add(img);
                canvas.sendObjectToBack(img);
                canvas.renderAll();
            });
        };

        reader.readAsDataURL(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    return (
        <div className="relative">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
            />
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="inline-block border-2 border-dashed border-gray-300 rounded-lg overflow-hidden"
            >
                <canvas ref={canvasRef} />
            </div>
        </div>
    );
}
