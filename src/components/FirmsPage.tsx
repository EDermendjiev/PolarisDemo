

interface Firm {
    id: number;
    name: string;
    city: string;
    address: string;
    vatNumber: string;
    mol: string;
}

const MOCK_FIRMS: Firm[] = [
    {
        id: 1,
        name: "Поларис ООД",
        city: "Варна",
        address: "ул. Ян Хуняди 5",
        vatNumber: "BG103984523",
        mol: "Иван Иванов"
    },
    {
        id: 2,
        name: "София Лайт ЕООД",
        city: "София",
        address: "бул. Цариградско шосе 115",
        vatNumber: "BG204551892",
        mol: "Петър Петров"
    },
    {
        id: 3,
        name: "Лампи ЕООД",
        city: "Пловдив",
        address: "ул. Васил Левски 23",
        vatNumber: "BG109552834",
        mol: "Георги Георгиев"
    },
    {
        id: 4,
        name: "Светлина АД",
        city: "Бургас",
        address: "к-с Славейков бл. 15",
        vatNumber: "BG102845611",
        mol: "Мария Димитрова"
    },
    {
        id: 5,
        name: "Електро Стил",
        city: "Русе",
        address: "ул. Александровска 1",
        vatNumber: "BG104885233",
        mol: "Димитър Симеонов"
    }
];

const FirmsPage = () => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Фирми</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500 uppercase tracking-wider">
                            <th className="px-6 py-3">Име</th>
                            <th className="px-6 py-3">Град</th>
                            <th className="px-6 py-3">Адрес</th>
                            <th className="px-6 py-3">ЕИК / ДДС</th>
                            <th className="px-6 py-3">МОЛ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {MOCK_FIRMS.map((firm) => (
                            <tr key={firm.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-gray-800 font-medium">{firm.name}</td>
                                <td className="px-6 py-4 text-gray-600">{firm.city}</td>
                                <td className="px-6 py-4 text-gray-600">{firm.address}</td>
                                <td className="px-6 py-4 text-gray-600">{firm.vatNumber}</td>
                                <td className="px-6 py-4 text-gray-600">{firm.mol}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FirmsPage;
