interface ProgressBarProps {
  value: number;  
  target: number; 
  currency: string;
}

const formatAmount = (amount: number, currency: string) =>
  new Intl.NumberFormat('en-US', { style: 'decimal', maximumFractionDigits: 0 }).format(amount) +
  ' ' +
  currency;

export const ProgressBar = ({ value, target, currency }: ProgressBarProps) => {
  const pct = target > 0 ? Math.min((value / target) * 100, 100) : 0;
  const isComplete = pct >= 100;

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span className="font-medium text-gray-700">{formatAmount(value, currency)} saved</span>
        <span>Goal: {formatAmount(target, currency)}</span>
      </div>
      <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isComplete ? 'bg-emerald-500' : 'bg-green-500'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className={`text-xs mt-1 font-semibold ${isComplete ? 'text-emerald-600' : 'text-gray-400'}`}>
        {isComplete ? 'Goal reached!' : `${pct.toFixed(1)}% of goal`}
      </p>
    </div>
  );
};
