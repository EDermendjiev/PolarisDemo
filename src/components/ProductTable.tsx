import { Pencil, Copy, Trash2, Check, ArrowRightLeft } from 'lucide-react';

interface ProductTableProps {
    onEdit: () => void;
}

const PRODUCTS = [
    {
        id: 1,
        model: "ACCORD RD",
        code: "1007",
        power: "12W",
        flux: "960 lm",
        colorTemp: "3000K",
        quantity: 10,
        unitPrice: 35.00,
        discount: 10,
        description: "LED луната ACCORD ROUND е проектирана за вграден монтаж, предлагайки елегантно"
    },
    {
        id: 2,
        model: "ACCORD SQ",
        code: "1008",
        power: "15W",
        flux: "1200 lm",
        colorTemp: "4000K",
        quantity: 8,
        unitPrice: 38.00,
        discount: 5,
        description: "Квадратна LED луна за вграждане с висока ефективност и модерен дизайн"
    },
    {
        id: 3,
        model: "LINEAR PRO",
        code: "2001",
        power: "30W",
        flux: "2400 lm",
        colorTemp: "4000K",
        quantity: 5,
        unitPrice: 85.00,
        discount: 12,
        description: "Линейно LED осветително тяло подходящо за офиси и търговски площи"
    },
    {
        id: 4,
        model: "SPOT MAX",
        code: "3005",
        power: "5W",
        flux: "400 lm",
        colorTemp: "3000K",
        quantity: 20,
        unitPrice: 15.00,
        discount: 0,
        description: "Компактен LED спот с насочване, идеален за акцентно осветление"
    },
    {
        id: 5,
        model: "PANEL 6060",
        code: "4001",
        power: "40W",
        flux: "3600 lm",
        colorTemp: "4000K",
        quantity: 12,
        unitPrice: 42.00,
        discount: 15,
        description: "Стандартен LED панел 60x60 за растерен таван, без трептене"
    }
];

const ProductTable = ({ onEdit }: ProductTableProps) => {
    const calculatePrice = (price: number, discount: number) => {
        return price * (1 - discount / 100);
    };

    const formatCurrency = (value: number) => {
        return value.toFixed(2).replace('.', ',') + ' €';
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header Action */}
            <div className="flex justify-end p-2 bg-gray-50 border-b border-gray-200">
                <button
                    onClick={onEdit}
                    className="flex items-center text-gray-500 bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300 transition-colors"
                >
                    <ArrowRightLeft size={16} className="mr-2" />
                    Промени позиция
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[1200px] border-collapse">
                    <thead>
                        {/* Checkbox Row */}
                        <tr className="bg-blue-100/50">
                            <th className="p-2 border border-gray-200 w-10"></th>
                            <th className="p-2 border border-gray-200 w-10 text-center"><div className="w-5 h-5 border border-status-active rounded flex items-center justify-center mx-auto text-status-active"><Check size={14} /></div></th>
                            <th className="p-2 border border-gray-200 w-24 text-center"><div className="w-5 h-5 border border-status-active rounded flex items-center justify-center mx-auto text-status-active"><Check size={14} /></div></th>
                            <th className="p-2 border border-gray-200 w-16 text-center"><div className="w-5 h-5 border border-status-active rounded flex items-center justify-center mx-auto text-status-active"><Check size={14} /></div></th>
                            <th className="p-2 border border-gray-200 text-center"><div className="w-5 h-5 border border-status-active rounded flex items-center justify-center mx-auto text-status-active"><Check size={14} /></div></th>
                            <th className="p-2 border border-gray-200 w-16 text-center"><div className="w-5 h-5 border border-status-active rounded flex items-center justify-center mx-auto text-status-active"><Check size={14} /></div></th>
                            <th className="p-2 border border-gray-200 w-16 text-center"><div className="w-5 h-5 border border-status-active rounded flex items-center justify-center mx-auto text-status-active"><Check size={14} /></div></th>
                            <th className="p-2 border border-gray-200 w-24 text-center"><div className="w-5 h-5 border border-status-active rounded flex items-center justify-center mx-auto text-status-active"><Check size={14} /></div></th>
                            <th className="p-2 border border-gray-200 w-16 text-center"><div className="w-5 h-5 border border-gray-300 rounded bg-white mx-auto"></div></th>
                            <th className="p-2 border border-gray-200 w-24 text-center"><div className="w-5 h-5 border border-status-active rounded flex items-center justify-center mx-auto text-status-active"><Check size={14} /></div></th>
                            <th className="p-2 border border-gray-200 w-28 text-center"><div className="w-5 h-5 border border-status-active rounded flex items-center justify-center mx-auto text-status-active"><Check size={14} /></div></th>
                            <th className="p-2 border border-gray-200 text-center"><div className="w-5 h-5 border border-status-active rounded flex items-center justify-center mx-auto text-status-active"><Check size={14} /></div></th>
                            <th className="p-2 border border-gray-200 w-20"></th>
                        </tr>
                        {/* Title Row */}
                        <tr className="bg-blue-100/50 text-gray-600 text-sm font-semibold">
                            <th className="p-2 border border-gray-200"></th>
                            <th className="p-2 border border-gray-200">№</th>
                            <th className="p-2 border border-gray-200">Продукт</th>
                            <th className="p-2 border border-gray-200">Чертеж</th>
                            <th className="p-2 border border-gray-200">Описание</th>
                            <th className="p-2 border border-gray-200">Мярка</th>
                            <th className="p-2 border border-gray-200">Кол.</th>
                            <th className="p-2 border border-gray-200">Ед. цена</th>
                            <th className="p-2 border border-gray-200">TO</th>
                            <th className="p-2 border border-gray-200">Ед. цена с ТО</th>
                            <th className="p-2 border border-gray-200">Обща цена без ДДС</th>
                            <th className="p-2 border border-gray-200">Забележки</th>
                            <th className="p-2 border border-gray-200"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {PRODUCTS.map((product, index) => {
                            const finalPrice = calculatePrice(product.unitPrice, product.discount);
                            const total = finalPrice * product.quantity;

                            return (
                                <tr key={product.id} className="bg-white hover:bg-gray-50">
                                    <td className="p-2 border border-gray-200 text-center align-middle">
                                        <div className="w-5 h-5 border border-gray-300 rounded mx-auto bg-white"></div>
                                    </td>
                                    <td className="p-2 border border-gray-200 text-center text-gray-700 align-middle">{index + 1}</td>
                                    <td className="p-2 border border-gray-200 text-center align-middle">
                                        {/* Product Image Placeholder */}
                                        <div className="w-12 h-12 bg-black rounded-full mx-auto relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-tr from-black via-gray-800 to-gray-600 opacity-80"></div>
                                        </div>
                                    </td>
                                    <td className="p-2 border border-gray-200 text-center align-middle">
                                        <div className="w-5 h-5 border border-status-active rounded flex items-center justify-center mx-auto text-status-active ring-1 ring-status-active"><Check size={14} /></div>
                                    </td>
                                    <td className="p-4 border border-gray-200 align-middle">
                                        <div className="grid grid-cols-[max-content_auto] gap-x-4 gap-y-1 text-sm text-gray-600">
                                            <span className="text-gray-400">Модел:</span>
                                            <span className="font-medium text-gray-800">{product.model}</span>
                                            <span className="text-gray-400">Код:</span>
                                            <span>{product.code}</span>
                                            <span className="text-gray-400">Мощност:</span>
                                            <span>{product.power}</span>
                                            <span className="text-gray-400">Светлинен поток:</span>
                                            <span>{product.flux}</span>
                                            <span className="text-gray-400">Цветна температура:</span>
                                            <span>{product.colorTemp}</span>
                                        </div>
                                    </td>
                                    <td className="p-2 border border-gray-200 text-center align-middle">
                                        <span className="px-2 py-1 rounded border border-gray-200 bg-white text-sm text-gray-600">бр.</span>
                                    </td>
                                    <td className="p-2 border border-gray-200 text-center align-middle">
                                        <span className="px-3 py-1 rounded border border-gray-200 bg-white text-sm text-gray-600">{product.quantity}</span>
                                    </td>
                                    <td className="p-2 border border-gray-200 text-center align-middle">
                                        <span className="px-2 py-1 rounded border border-gray-200 bg-white text-sm text-gray-600">{formatCurrency(product.unitPrice)}</span>
                                    </td>
                                    <td className="p-2 border border-gray-200 text-center align-middle">
                                        <span className="px-2 py-1 rounded border border-gray-200 bg-white text-sm text-gray-600">{product.discount}%</span>
                                    </td>
                                    <td className="p-2 border border-gray-200 text-center align-middle">
                                        <span className="px-2 py-1 rounded border border-gray-200 bg-white text-sm text-gray-600">{formatCurrency(finalPrice)}</span>
                                    </td>
                                    <td className="p-2 border border-gray-200 text-center align-middle">
                                        <span className="px-2 py-1 rounded border border-gray-200 bg-white text-sm font-semibold text-gray-700">{formatCurrency(total)}</span>
                                    </td>
                                    <td className="p-2 border border-gray-200 text-center text-xs text-gray-500 align-middle max-w-[200px]">
                                        {product.description}
                                    </td>
                                    <td className="p-2 border border-gray-200 align-middle">
                                        <div className="flex space-x-2 justify-center">
                                            <Pencil
                                                size={16}
                                                className="text-gray-500 hover:text-gray-700 cursor-pointer"
                                                onClick={onEdit}
                                            />
                                            <Copy size={16} className="text-gray-500 hover:text-gray-700 cursor-pointer" />
                                            <Trash2 size={16} className="text-gray-500 hover:text-danger cursor-pointer" />
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductTable;
