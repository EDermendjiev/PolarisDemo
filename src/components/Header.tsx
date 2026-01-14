import { ChevronDown } from 'lucide-react';

const Header = () => {
    return (
        <header className="bg-white px-8 py-4 flex items-center justify-between border-b border-gray-200">
            {/* Logo */}
            <div className="flex items-center">
                <div className="text-2xl font-bold tracking-widest text-gray-800">
                    POLARIS
                    <span className="block text-xs tracking-[0.2em] text-gray-400 font-normal">LIGHTING</span>
                </div>
            </div>

            {/* Center Dropdown */}
            <div className="flex-1 max-w-xl mx-8">
                <button className="w-full flex items-center justify-between bg-gray-100 px-4 py-2 rounded text-gray-600 hover:bg-gray-200 transition-colors">
                    <span>Оферта за Поларис ООД</span>
                    <ChevronDown size={20} className="text-gray-400" />
                </button>
            </div>

            {/* Right Section: User & Logout */}
            <div className="flex items-center space-x-4">
                <div className="flex items-center bg-gray-100 rounded px-4 py-2">
                    <span className="text-gray-500 mr-2 text-sm">Служител:</span>
                    <span className="font-semibold text-gray-800 mr-4 text-sm">Иван Иванов</span>
                    <div className="h-4 w-px bg-gray-300 mx-2"></div>
                    <span className="text-gray-500 text-sm">i.ivanov@polarislighting.bg</span>
                </div>

                <button className="bg-danger text-white px-6 py-2 rounded shadow hover:bg-red-700 transition-colors font-medium">
                    Изход
                </button>
            </div>
        </header>
    );
};

export default Header;
