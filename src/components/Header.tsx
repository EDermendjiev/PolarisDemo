import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import polarisLogo from '../assets/polarisLogo.png';

const FIRMS = [
    "Оферта за Поларис ООД",
    "Оферта за София Лайт",
    "Оферта за Лампи ЕООД",
    "Оферта за Светлина АД",
    "Оферта за Електро Стил"
];

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFirm, setSelectedFirm] = useState(FIRMS[0]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (firm: string) => {
        setSelectedFirm(firm);
        setIsOpen(false);
    };

    return (
        <header className="bg-white px-8 py-4 flex items-center justify-between border-b border-gray-200">
            {/* Logo */}
            <div className="flex items-center">
                <img
                    src={polarisLogo}
                    alt="Polaris Lighting"
                    className="h-32 w-auto object-contain"
                />
            </div>

            {/* Center Dropdown */}
            <div className="flex-1 max-w-xl mx-8 relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between bg-gray-100 px-4 py-2 rounded text-gray-600 hover:bg-gray-200 transition-colors"
                >
                    <span className="truncate">{selectedFirm}</span>
                    <ChevronDown size={20} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                    <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded shadow-lg z-50 max-h-60 overflow-y-auto">
                        {FIRMS.map((firm) => (
                            <button
                                key={firm}
                                onClick={() => handleSelect(firm)}
                                className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors ${selectedFirm === firm ? 'bg-gray-50 font-medium text-gray-800' : 'text-gray-600'
                                    }`}
                            >
                                {firm}
                            </button>
                        ))}
                    </div>
                )}
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
