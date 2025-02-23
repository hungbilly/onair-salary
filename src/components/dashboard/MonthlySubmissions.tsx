import { format } from "date-fns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MonthlyTable } from "./MonthlyTable";

interface Timesheet {
  id: string;
  work_date: string;
  hours: number;
  start_time: string | null;
  end_time: string | null;
  work_types: {
    name: string;
    rate_type: 'fixed' | 'hourly';
  };
  work_type_id: string;
  custom_rate?: number | null;
}

interface MonthlySubmissionsProps {
  timesheets: Timesheet[];
  workTypeRates: Record<string, { hourly_rate?: number; fixed_rate?: number; }>;
  onTimesheetUpdated: () => void;
}

export const MonthlySubmissions = ({ 
  timesheets, 
  workTypeRates, 
  onTimesheetUpdated 
}: MonthlySubmissionsProps) => {
  // Group timesheets by month
  const monthlyTimesheets = timesheets.reduce((acc: Record<string, Timesheet[]>, timesheet) => {
    const monthKey = format(new Date(timesheet.work_date), "MMMM yyyy");
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(timesheet);
    return acc;
  }, {});

  // Calculate monthly total by summing up entry totals
  const calculateMonthTotal = (sheets: Timesheet[]) => {
    return sheets.reduce((total, timesheet) => {
      console.log('MonthlySubmissions - Processing timesheet:', {
        id: timesheet.id,
        workType: timesheet.work_types.name,
        hours: timesheet.hours,
        custom_rate: timesheet.custom_rate
      });

      // Handle "Other" work type with custom rate
      if (timesheet.work_types.name === "Other" && timesheet.custom_rate) {
        const entryTotal = timesheet.custom_rate * timesheet.hours;
        console.log('MonthlySubmissions - Custom rate calculation:', {
          custom_rate: timesheet.custom_rate,
          hours: timesheet.hours,
          entryTotal
        });
        return total + entryTotal;
      }

      // Handle regular work types
      const rates = workTypeRates[timesheet.work_type_id];
      const rate = timesheet.work_types.rate_type === 'fixed' 
        ? rates?.fixed_rate 
        : rates?.hourly_rate;
      
      const entryTotal = rate ? rate * timesheet.hours : 0;
      console.log('MonthlySubmissions - Regular rate calculation:', {
        rate_type: timesheet.work_types.rate_type,
        rate,
        hours: timesheet.hours,
        entryTotal
      });

      return total + entryTotal;
    }, 0);
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      {Object.entries(monthlyTimesheets).map(([month, sheets]) => {
        const monthTotal = calculateMonthTotal(sheets);
        return (
          <AccordionItem value={month} key={month}>
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex justify-between w-full pr-4">
                <span>{month}</span>
                <span className="text-green-600">
                  ${monthTotal.toFixed(2)}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <MonthlyTable 
                timesheets={sheets} 
                workTypeRates={workTypeRates} 
                onTimesheetUpdated={onTimesheetUpdated}
              />
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};