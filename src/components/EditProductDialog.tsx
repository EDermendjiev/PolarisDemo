import { Trash2, Pencil, Check, ArrowRightLeft, Plus } from 'lucide-react';


interface EditProductDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const EditProductDialog = ({ isOpen, onClose }: EditProductDialogProps) => {
    if (!isOpen) return null;

    const FormField = ({ label, value }: { label: string; value: string }) => (
        <div className="mb-4">
            <div className="flex items-center mb-1">
                <label className="text-gray-600 font-medium text-sm mr-2">{label}</label>
                <Pencil size={12} className="text-gray-400" />
            </div>
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    defaultValue={value}
                    className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-gray-700 text-sm focus:outline-none focus:border-blue-400"
                />
                <div className="w-8 h-8 bg-white border border-gray-200 rounded flex items-center justify-center shrink-0">
                    <Check size={16} className="text-status-active" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#F5F5F5] rounded-lg shadow-xl w-full max-w-4xl p-8 relative max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <h2 className="text-2xl font-bold text-gray-700 mb-8">Редакция на продукт</h2>

                {/* Images Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Product Image */}
                    <div className="bg-white p-4 rounded shadow-sm aspect-square relative flex items-center justify-center group">
                        <div className="absolute top-4 left-4 cursor-pointer text-gray-600 hover:text-red-500">
                            <Trash2 size={20} />
                        </div>
                        <div className="absolute top-4 right-4 cursor-pointer text-gray-600 hover:text-blue-500">
                            <Pencil size={20} />
                        </div>
                        <div className="w-48 h-48 bg-black rounded-full overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-black via-gray-800 to-gray-600 opacity-90"></div>
                        </div>
                    </div>

                    {/* Technical Drawing */}
                    <div className="bg-white p-4 rounded shadow-sm aspect-square relative flex items-center justify-center">
                        <div className="absolute top-4 left-4 cursor-pointer text-gray-600 hover:text-red-500">
                            <Trash2 size={20} />
                        </div>
                        <div className="absolute top-4 right-4 cursor-pointer text-gray-600 hover:text-blue-500">
                            <Pencil size={20} />
                        </div>
                        <div className="text-center">
                            {/* Simple SVG placeholder for the drawing */}
                            <svg width="200" height="200" viewBox="0 0 200 200" fill="none" stroke="currentColor" className="text-gray-400 mx-auto">
                                <rect x="50" y="50" width="100" height="100" />
                                <line x1="50" y1="50" x2="150" y2="150" />
                                <line x1="150" y1="50" x2="50" y2="150" />
                            </svg>
                            <p className="text-xs text-center mt-2 text-gray-500">Technical Drawing</p>
                        </div>
                    </div>
                </div>

                {/* Form Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 mb-8">
                    <FormField label="Код" value="1007" />
                    <FormField label="Продукт" value="ACCORD RD" />
                    <FormField label="Мощност" value="12W" />
                    <FormField label="Светлинен поток" value="960 lm" />
                    <FormField label="Цветна температура" value="3000K" />
                    <FormField label="Напрежение" value="220V" />
                    <FormField label="Цветопредаване" value="Ra>90" />
                    <FormField label="Цвят" value="Черен" />
                    <FormField label="Размер" value="Ø94 / H68 mm" />
                </div>

                {/* Buttons Row 1 */}
                <div className="flex space-x-4 mb-6">
                    <button className="flex items-center bg-[#E5B55A] hover:bg-[#D4A54F] text-white px-6 py-2 rounded font-medium shadow-sm transition-colors">
                        <ArrowRightLeft size={18} className="mr-2" />
                        Промени позиция
                    </button>
                    <button className="flex items-center bg-[#E5B55A] hover:bg-[#D4A54F] text-white px-6 py-2 rounded font-medium shadow-sm transition-colors">
                        Добави ред
                        <Plus size={18} className="ml-2" />
                    </button>
                </div>

                {/* Note Section */}
                <div className="mb-12">
                    <div className="flex items-center mb-2">
                        <label className="text-gray-600 font-medium mr-2">Забележка</label>
                        <Pencil size={12} className="text-gray-400 mr-2" />
                        <div className="w-5 h-5 bg-white border border-gray-200 rounded flex items-center justify-center">
                            <Check size={12} className="text-status-active" />
                        </div>
                    </div>
                    <textarea
                        className="w-full h-32 bg-white border border-gray-200 rounded-lg p-4 text-gray-600 text-sm resize-none focus:outline-none focus:border-blue-400"
                        defaultValue="LED луната ACCORD ROUND е проектирана за вграден монтаж, предлагайки елегантно декоративно осветление с висока степен на защита."
                    />
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="bg-[#E53935] hover:bg-red-700 text-white px-8 py-2 rounded font-medium shadow-sm transition-colors"
                    >
                        Отказ
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-status-active hover:bg-green-600 text-white px-8 py-2 rounded font-medium shadow-sm transition-colors"
                    >
                        Запази
                    </button>
                </div>

            </div>
        </div>
    );
};

export default EditProductDialog;
