import Image, { StaticImageData } from 'next/image';

const BalanceCard = ({ icon, label, amount }: { icon: StaticImageData; label: string; amount: number }) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="bg-white rounded-xl p-4 flex-1">
      <div className="flex items-center mb-2">
        <Image src={icon} alt="label" className="w-8 h-8" />
      </div>
      <p className="text-sm text-gray-500 mb-2 font-semibold">{label}</p>
      <p className="text-2xl font-semibold">${formatter.format(amount)}</p>
    </div>
  );
};

export default BalanceCard;
