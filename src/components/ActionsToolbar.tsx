import { Plus, Calculator, Percent, FileDown, FileSpreadsheet, Printer } from 'lucide-react';

interface ActionsToolbarProps {
    onExportExcel?: () => void;
}

const ActionsToolbar = ({ onExportExcel }: ActionsToolbarProps) => {
    return (
        <div className="bg-white rounded-lg shadow-sm p-2 mb-6 flex items-center justify-between overflow-x-auto">
            <div className="flex space-x-2">
                <button className="flex items-center bg-gray-100 px-4 py-2 rounded text-gray-600 hover:bg-gray-200 font-medium">
                    <Plus size={18} className="mr-2 text-gray-500" />
                    Добави ред
                </button>
                <button className="flex items-center bg-gray-100 px-4 py-2 rounded text-gray-600 hover:bg-gray-200 font-medium">
                    <Plus size={18} className="mr-2 text-gray-500" />
                    Добави колона
                </button>
            </div>

            <div className="flex space-x-2 border-l border-r border-gray-200 px-4 mx-2">
                <div className="flex items-center bg-gray-100 px-3 py-2 rounded">
                    <Calculator size={18} className="text-gray-500 mr-2" />
                    <span className="mr-2 text-gray-600">ДДС</span>
                    <span className="bg-white px-2 rounded text-sm font-semibold text-gray-700">20%</span>
                </div>
                <div className="flex items-center bg-gray-100 px-3 py-2 rounded">
                    <Percent size={18} className="text-gray-500 mr-2" />
                    <span className="mr-2 text-gray-600">Отстъпка</span>
                    <span className="bg-white px-2 rounded text-sm font-semibold text-gray-700">10%</span>
                </div>
            </div>

            <div className="flex space-x-2">
                <button className="flex items-center bg-gray-100 px-4 py-2 rounded text-gray-600 hover:bg-gray-200 font-medium">
                    <FileDown size={18} className="mr-2 text-gray-500" />
                    Експорт PDF
                </button>
                <button
                    onClick={onExportExcel}
                    className="flex items-center bg-gray-100 px-4 py-2 rounded text-gray-600 hover:bg-gray-200 font-medium"
                >
                    <FileSpreadsheet size={18} className="mr-2 text-gray-500" />
                    Експорт Excel
                </button>
                <button className="flex items-center bg-gray-100 px-4 py-2 rounded text-gray-600 hover:bg-gray-200 font-medium">
                    <Printer size={18} className="mr-2 text-gray-500" />
                    Печат
                </button>
            </div>
        </div>
    );
};

export default ActionsToolbar;
