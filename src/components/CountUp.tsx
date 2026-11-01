type CountUpProps = {
  name: string;
  num: number;
  onClick?: () => void;
};

export const CountUp = ({ name, num, onClick }: CountUpProps) => {
  return (
    <button
      onClick={onClick}
      className="flex min-w-16 cursor-pointer flex-col items-center rounded-lg border border-gray-300 bg-white px-4 py-2 select-none active:bg-gray-200"
    >
      <span className="text-sm text-gray-600">{name}</span>
      <span className="text-xl font-bold">{num}</span>
    </button>
  );
};