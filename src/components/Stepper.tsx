type CounterProps = {
  name: string;
  num: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onClick?: () => void;
};

export function Stepper({ name, num, onIncrement, onDecrement, onClick }: CounterProps) {
  return (
    <div className="flex shrink-0 flex-col items-center rounded-lg border border-gray-300 bg-white px-2 py-2 select-none">
      <span className="text-sm text-gray-600">{name}</span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={()=>{
            onDecrement();
            onClick?.();
          }}
          disabled={num <= 0}
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-gray-300 text-lg leading-none font-bold text-gray-600 hover:bg-gray-100 active:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          −
        </button>
        <span className="min-w-6 text-center text-xl font-bold">{num}</span>
        <button
          type="button"
          onClick={()=>{
            onIncrement();
            onClick?.();
          }}
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-gray-300 text-lg leading-none font-bold text-gray-600 hover:bg-gray-100 active:bg-gray-200"
        >
          +
        </button>
      </div>
    </div>
  );
}