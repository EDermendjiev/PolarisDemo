import { useState } from 'react';
import { Pencil, Copy, Trash2, Check, ArrowRightLeft, ArrowUp, ArrowDown } from 'lucide-react';

export interface Product {
    id: number;
    model: string;
    code: string;
    power: string;
    flux: string;
    colorTemp: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    description: string;
    selected: boolean;
    hasDrawing: boolean;
}

interface ProductTableProps {
    products: Product[];
    onUpdateProducts: (products: Product[]) => void;
    onEdit: () => void;
}

const Checkbox = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
        onClick={onChange}
        className={`w-5 h-5 border rounded flex items-center justify-center mx-auto transition-all ${checked
            ? 'border-status-active text-status-active bg-white ring-1 ring-status-active'
            : 'border-gray-300 bg-white text-transparent hover:border-gray-400'
            }`}
    >
        <Check size={14} className={checked ? 'opacity-100' : 'opacity-0'} />
    </button>
);

const ProductTable = ({ products, onUpdateProducts, onEdit }: ProductTableProps) => {
    const [isRearranging, setIsRearranging] = useState(false);
    // State for the top row of checkboxes (11 columns)
    const [headerChecks, setHeaderChecks] = useState<boolean[]>([true, true, true, true, true, true, true, false, true, true, true]);


    const calculatePrice = (price: number, discount: number) => {
        return price * (1 - discount / 100);
    };

    const formatCurrency = (value: number) => {
        return value.toFixed(2).replace('.', ',') + ' €';
    };

    const moveRow = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === products.length - 1) return;

        const newProducts = [...products];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        // Swap elements
        [newProducts[index], newProducts[targetIndex]] = [newProducts[targetIndex], newProducts[index]];

        onUpdateProducts(newProducts);
    };

    const toggleProductSelection = (id: number) => {
        onUpdateProducts(products.map(p => p.id === id ? { ...p, selected: !p.selected } : p));
    };

    const toggleProductDrawing = (id: number) => {
        onUpdateProducts(products.map(p => p.id === id ? { ...p, hasDrawing: !p.hasDrawing } : p));
    };

    const toggleHeaderCheck = (index: number) => {
        const newChecks = [...headerChecks];
        newChecks[index] = !newChecks[index];
        setHeaderChecks(newChecks);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header Action */}
            <div className="flex justify-end p-2 bg-gray-50 border-b border-gray-200">
                <button
                    onClick={() => setIsRearranging(!isRearranging)}
                    className={`flex items-center px-3 py-1 rounded text-sm transition-colors ${isRearranging
                        ? 'bg-status-active text-white hover:bg-green-600'
                        : 'text-gray-500 bg-gray-200 hover:bg-gray-300'
                        }`}
                >
                    <ArrowRightLeft size={16} className="mr-2" />
                    {isRearranging ? 'Запази подредбата' : 'Промени позиция'}
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[1200px] border-collapse">
                    <thead>
                        {/* Checkbox Row */}
                        <tr className="bg-blue-100/50">
                            <th className="p-2 border border-gray-200 w-10"></th>
                            {headerChecks.map((checked, index) => (
                                <th key={index} className={`p-2 border border-gray-200 text-center ${index === 0 ? 'w-10' : ''
                                    } ${index === 1 ? 'w-24' : ''} ${index === 2 ? 'w-16' : ''} ${index === 4 ? 'w-16' : ''
                                    } ${index === 5 ? 'w-16' : ''} ${index === 6 ? 'w-24' : ''} ${index === 7 ? 'w-16' : ''
                                    } ${index === 8 ? 'w-24' : ''} ${index === 9 ? 'w-28' : ''}`}>
                                    <Checkbox checked={checked} onChange={() => toggleHeaderCheck(index)} />
                                </th>
                            ))}
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
                        {products.map((product, index) => {
                            const finalPrice = calculatePrice(product.unitPrice, product.discount);
                            const total = finalPrice * product.quantity;

                            return (
                                <tr key={product.id} className="bg-white hover:bg-gray-50">
                                    <td className="p-2 border border-gray-200 text-center align-middle">
                                        {isRearranging ? (
                                            <div className="flex flex-col items-center gap-1">
                                                <button
                                                    onClick={() => moveRow(index, 'up')}
                                                    disabled={index === 0}
                                                    className="p-1 hover:bg-gray-100 rounded text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                                >
                                                    <ArrowUp size={14} />
                                                </button>
                                                <button
                                                    onClick={() => moveRow(index, 'down')}
                                                    disabled={index === products.length - 1}
                                                    className="p-1 hover:bg-gray-100 rounded text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                                >
                                                    <ArrowDown size={14} />
                                                </button>
                                            </div>
                                        ) : (
                                            <Checkbox
                                                checked={product.selected}
                                                onChange={() => toggleProductSelection(product.id)}
                                            />
                                        )}
                                    </td>
                                    <td className="p-2 border border-gray-200 text-center text-gray-700 align-middle">{index + 1}</td>
                                    <td className="p-2 border border-gray-200 text-center align-middle">
                                        {/* Product Image Placeholder */}
                                        <div className="w-12 h-12 bg-black rounded-full mx-auto relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-tr from-black via-gray-800 to-gray-600 opacity-80"></div>
                                        </div>
                                    </td>
                                    <td className="p-2 border border-gray-200 text-center align-middle">
                                        <Checkbox
                                            checked={product.hasDrawing}
                                            onChange={() => toggleProductDrawing(product.id)}
                                        />
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
