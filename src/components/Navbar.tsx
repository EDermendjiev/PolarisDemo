import { Plus } from 'lucide-react';

const Navbar = () => {
    const navItems = ['Продукти', 'Оферти', 'Фирми', 'Профил'];
    const activeItem = 'Оферти';

    return (
        <div className="bg-header-bg text-white">
            <div className="px-8 flex items-center justify-between h-14">
                {/* Navigation Links */}
                <nav className="flex items-center h-full">
                    {navItems.map((item) => (
                        <a
                            key={item}
                            href="#"
                            className={`h-full flex items-center px-6 border-r border-[#6B8CA9] hover:bg-[#4A6B88] transition-colors ${item === activeItem ? 'bg-[#4A6B88]' : ''
                                }`}
                        >
                            {item}
                        </a>
                    ))}
                </nav>

                {/* New Offer Button */}
                <button className="flex items-center bg-[#4A5D75] hover:bg-[#3A4D65] text-white px-4 py-1.5 rounded text-sm font-medium transition-colors">
                    Нова оферта
                    <Plus size={16} className="ml-2" />
                </button>
            </div>

            {/* Breadcrumbs / Sub-nav */}
            <div className="bg-[#E5E5E5] px-8 py-2 text-sm text-gray-500 flex items-center">
                <span className="cursor-pointer hover:underline">{'<'} Оферти</span>
                <span className="mx-2">{'<'}</span>
                <span className="text-gray-400">Оферта за Поларис ООД</span>
            </div>
        </div>
    );
};

export default Navbar;
