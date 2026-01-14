import { X } from 'lucide-react';

interface EditFirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const EditFirmDialog = ({ isOpen, onClose }: EditFirmDialogProps) => {
    if (!isOpen) return null;

    const InputField = ({ label, value }: { label: string; value: string }) => (
        <div className="grid grid-cols-[140px_1fr] items-center gap-4 mb-3">
            <label className="text-gray-500 text-sm">{label}:</label>
            <input
                type="text"
                defaultValue={value}
                className="w-full bg-white border border-gray-200 rounded px-3 py-1.5 text-gray-700 text-sm focus:outline-none focus:border-blue-400"
            />
        </div>
    );

    return (
        <div className="absolute top-[50px] left-[20px] z-30">
            <div className="bg-[#F5F5F5] rounded-lg shadow-xl w-[600px] p-6 relative border border-gray-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X size={20} />
                </button>
                <h3 className="text-lg font-bold text-gray-700 mb-6">Данни на фирмата</h3>

                <div className="mb-2">
                    <InputField label="Фирма" value="Поларис ООД" />
                    <InputField label="Име в офертата" value="Поларис ООД" />
                    <InputField label="ЕИК / Булстат" value="123456789" />
                    <InputField label="ДДС №" value="123456789" />
                    <InputField label="Адрес" value="гр. Варна" />
                    <InputField label="Лице за контакт" value="Георги Георгиев" />
                    <InputField label="Имейл" value="g.georgiev@polaris.bg" />
                    <InputField label="Тел." value="0812345678" />
                </div>
            </div>
        </div>
    );
};

export default EditFirmDialog;
