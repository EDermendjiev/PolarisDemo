import React from 'react';

const OfferSummary = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Left Section: Notes */}
            <div className="bg-gray-100/50 rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-gray-600 font-bold mb-4 text-lg">Бележки към офертата:</h3>
                <div className="bg-white rounded p-6 h-64 shadow-sm border border-gray-100 text-gray-500 space-y-3">
                    <p>Срок на доставка:</p>
                    <p>Валидност на офертата:</p>
                    <p>Монтаж:</p>
                    <p>Начин на плащане:</p>
                </div>
            </div>

            {/* Right Section: Totals */}
            <div className="bg-gray-100/50 rounded-lg p-6 shadow-sm border border-gray-200 flex flex-col justify-between">
                <div className="space-y-4">
                    <div className="flex justify-between items-center bg-white p-3 rounded shadow-sm border border-gray-100">
                        <span className="text-gray-600">Обща сума без ДДС с 10% ТО</span>
                        <span className="text-gray-600 font-medium">945,00 €</span>
                    </div>
                    <div className="flex justify-between items-center px-3">
                        <span className="text-gray-500">ДДС 20%</span>
                        <span className="text-gray-500">189,00 €</span>
                    </div>

                    <hr className="border-gray-300 my-4" />

                    <div className="flex justify-between items-center px-3">
                        <span className="text-xl font-bold text-gray-700">Обща сума с ДДС</span>
                        <span className="text-xl font-bold text-[#E53935]">1134,00 €</span>
                    </div>
                </div>

                <button className="w-full bg-[#E5B55A] hover:bg-[#D4A54F] text-white font-bold py-3 px-4 rounded shadow-sm mt-8 transition-colors">
                    Приключи офертата
                </button>
            </div>
        </div>
    );
};

export default OfferSummary;
