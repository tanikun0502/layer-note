interface HeaderProps {
    onNewPage: () => void;
}

export default function Header({ onNewPage }: HeaderProps) {
    return (
        <header className="bg-pastel-sage text-gray-800 shadow-lg">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                <h1 className="text-3xl font-display tracking-wide text-gray-700">
                    LayerNote
                </h1>
                <button
                    onClick={onNewPage}
                    className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                    + 新規ページ作成
                </button>
            </div>
        </header>
    );
}
