import { MonthlyCard } from "./MonthlyCard";
import { format } from "date-fns";

interface MonthlyStatsProps {
  totalSalary: number;
  totalExpenses: number;
  netAmount: number;
  date: Date;
}

export const MonthlyStats = ({ 
  totalSalary, 
  totalExpenses, 
  netAmount, 
  date
}: MonthlyStatsProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="w-24 text-sm font-medium text-muted-foreground">
        {format(date, "MMMM")}
      </div>
      <div className="flex-1 grid grid-cols-3 gap-2">
        <MonthlyCard
          amount={totalSalary}
          date={date}
          colorClass="text-green-600"
        />
        <MonthlyCard
          amount={totalExpenses}
          date={date}
          colorClass="text-blue-600"
        />
        <MonthlyCard
          amount={netAmount}
          date={date}
          colorClass={netAmount >= 0 ? 'text-green-600' : 'text-red-600'}
        />
      </div>
    </div>
  );
};