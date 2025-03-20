
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatMonthYear } from '@/utils/dateUtils';

interface CalendarHeaderProps {
  currentMonth: Date;
  prevMonth: () => void;
  nextMonth: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentMonth,
  prevMonth,
  nextMonth,
}) => {
  return (
    <div className="flex items-center justify-between mb-4 calendar-header">
      <h2 className="text-xl font-semibold">{formatMonthYear(currentMonth)}</h2>
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={prevMonth}
          className="calendar-nav-button"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Previous month</span>
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={nextMonth}
          className="calendar-nav-button"
        >
          <ChevronRight className="h-5 w-5" />
          <span className="sr-only">Next month</span>
        </Button>
      </div>
    </div>
  );
};

export default CalendarHeader;
