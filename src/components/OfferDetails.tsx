import { useState } from 'react';
import { ChevronDown, Pencil, User, Calendar, Search } from 'lucide-react';
import EditFirmDialog from './EditFirmDialog';

const OfferDetails = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isFirmDialogOpen, setIsFirmDialogOpen] = useState(false);
    const [selectedFirm, setSelectedFirm] = useState("Поларис ООД");
    const [searchTerm, setSearchTerm] = useState("");

    const firms = [
        "Фирма ЕООД 1",
        "Фирма ЕООД 2",
        "Фирма ЕООД 3",
        "Фирма ЕООД 4",
        "Фирма ЕООД 5"
    ];

    const filteredFirms = firms.filter(firm =>
        firm.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center space-x-2 relative">
                    <h1 className="text-2xl font-bold text-gray-700 flex items-center">
                        <span className="mr-2">Оферта за</span>
                        <div
                            className="cursor-pointer hover:bg-gray-50 rounded px-1 -ml-1 flex items-center relative transition-colors"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <span>{selectedFirm}</span>
                            <ChevronDown
                                size={20}
                                className={`ml-2 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                            />
                        </div>
                    </h1>


                    {/* Pencil Icon */}
                    <div className="relative">
                        <Pencil
                            size={18}
                            className="text-gray-400 cursor-pointer hover:text-gray-600 ml-2"
                            onClick={() => setIsFirmDialogOpen(!isFirmDialogOpen)}
                        />

                        {/* Edit Firm Dialog */}
                        <EditFirmDialog
                            isOpen={isFirmDialogOpen}
                            onClose={() => setIsFirmDialogOpen(false)}
                        />
                    </div>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="absolute top-full left-0 mt-2 w-80 bg-[#F8F9FA] rounded-lg shadow-xl border border-gray-100 z-20 py-2">
                            <div className="px-4 pb-2 mb-2 border-b border-gray-200">
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full bg-white border border-gray-200 rounded-md py-1.5 pl-3 pr-8 text-sm focus:outline-none focus:border-blue-400"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>
                            <div className="max-h-60 overflow-y-auto">
                                {filteredFirms.map((firm, index) => (
                                    <div
                                        key={firm}
                                        className={`px-4 py-3 cursor-pointer text-sm text-gray-600 hover:bg-gray-100 border-b border-gray-100 last:border-0`}
                                        onClick={() => {
                                            setSelectedFirm(firm);
                                            setIsDropdownOpen(false);
                                        }}
                                    >
                                        {firm}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <button className="bg-status-active text-white px-6 py-2 rounded flex items-center space-x-2">
                    <span>Активна</span>
                    <ChevronDown size={18} className="ml-2" />
                </button>
            </div>

            <div className="flex items-center space-x-12 border-t pt-6">
                <div className="flex items-center text-gray-600">
                    <User className="mr-3" size={24} />
                    <span className="text-gray-400 mr-2">Изготвил:</span>
                    <span className="font-bold text-gray-700">Иван Иванов</span>
                </div>

                <div className="flex items-center text-gray-600">
                    <Calendar className="mr-3" size={24} />
                    <span className="font-semibold text-gray-700 mr-2">01.01.2026</span>
                    <ChevronDown size={18} className="text-gray-400" />
                </div>
            </div>
        </div>
    );
};

export default OfferDetails;
