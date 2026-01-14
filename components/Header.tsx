import { FaBars } from 'react-icons/fa';

interface HeaderProps {
    onNewPage: () => void;
    onMenuToggle: () => void; // メニュー開閉用のプロパティを追加
}

export default function Header({ onNewPage, onMenuToggle }: HeaderProps) {
    return (
        <header className="bg-pastel-sage text-gray-800 shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* モバイル用メニューボタン */}
                    <button
                        onClick={onMenuToggle}
                        className="lg:hidden p-2 hover:bg-white bg-opacity-20 rounded-md transition-colors"
                        title="メニューを開く"
                    >
                        <FaBars className="text-xl text-gray-700" />
                    </button>
                    <h1 className="text-2xl sm:text-3xl font-display tracking-wide text-gray-700">
                        LayerNote
                    </h1>
                </div>
                <button
                    onClick={onNewPage}
                    className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg text-sm sm:text-base"
                >
                    <span className="hidden sm:inline">+ </span>新規ページ<span className="hidden sm:inline">作成</span>
                </button>
            </div>
        </header>
    );
}
