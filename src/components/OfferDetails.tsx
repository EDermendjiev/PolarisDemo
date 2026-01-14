import { ChevronDown, Pencil, User, Calendar } from 'lucide-react';

const OfferDetails = () => {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center space-x-4">
                    <h1 className="text-2xl font-bold text-gray-700">Оферта за Поларис ООД</h1>
                    <ChevronDown className="text-gray-400 cursor-pointer" />
                    <Pencil size={18} className="text-gray-400 cursor-pointer hover:text-gray-600" />
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
