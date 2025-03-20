
import React, { useState, useEffect } from 'react';
import { getDaysInMonth, isCurrentDay, getEventsForDay } from '@/utils/dateUtils';
import { Event, fetchAllEvents } from '@/services/eventApi';
import CalendarHeader from './CalendarHeader';
import EventItem from './EventItem';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const Calendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showFallbackNotice, setShowFallbackNotice] = useState<boolean>(false);

  // Days of the week for the header
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Fetch events when the component mounts or month changes
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const allEvents = await fetchAllEvents();
        setEvents(allEvents);
        
        // Check if we're using fallback data by looking at event IDs
        // Fallback data has specific ID patterns like 'lc-weekly-contest' 
        const hasFallbackData = allEvents.some(event => 
          event.id.includes('weekly-contest') || 
          event.id.includes('long-challenge') ||
          event.id.includes('beginner-contest')
        );
        
        setShowFallbackNotice(hasFallbackData);
      } catch (error) {
        console.error('Error loading events:', error);
        setError('Failed to load events. Please try again later.');
        toast.error('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []); // Removed dependency on currentMonth to avoid excessive API calls

  // Navigate to the previous month
  const prevMonth = () => {
    setCurrentMonth(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  // Navigate to the next month
  const nextMonth = () => {
    setCurrentMonth(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  // Get all days in the current month
  const days = getDaysInMonth(currentMonth);

  // Add empty cells for days before the first day of the month
  const firstDayOfMonth = days[0].getDay();
  const emptyCells = Array(firstDayOfMonth).fill(null);

  // Filter events for the current month to improve performance
  const currentMonthEvents = events.filter(event => {
    const eventStartMonth = event.startTime.getMonth();
    const eventStartYear = event.startTime.getFullYear();
    const currentMonthNumber = currentMonth.getMonth();
    const currentYear = currentMonth.getFullYear();
    
    return eventStartMonth === currentMonthNumber && eventStartYear === currentYear;
  });

  return (
    <div className="calendar-container">
      <CalendarHeader 
        currentMonth={currentMonth} 
        prevMonth={prevMonth} 
        nextMonth={nextMonth} 
      />
      
      {showFallbackNotice && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-sm">
          <p className="font-medium">Note: Some platform APIs are currently unavailable</p>
          <p>Some contests shown are sample data. We'll display real data when the APIs are available again.</p>
        </div>
      )}
      
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg text-gray-600">Loading contests from platforms...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-lg text-red-500">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-7 text-center calendar-days">
          {daysOfWeek.map(day => (
            <div key={day} className="py-2 font-medium text-sm">
              {day}
            </div>
          ))}

          {/* Empty cells for days before the first day of the month */}
          {emptyCells.map((_, index) => (
            <div key={`empty-${index}`} className="date-cell bg-gray-50"></div>
          ))}

          {/* Calendar days */}
          {days.map(day => {
            const dayEvents = getEventsForDay(day, currentMonthEvents);
            const isToday = isCurrentDay(day);
            
            return (
              <div 
                key={day.toString()} 
                className={`date-cell ${isToday ? 'bg-blue-50 border border-blue-200' : ''}`}
              >
                <div className={`date-number ${isToday ? 'font-bold text-blue-600' : ''}`}>
                  {day.getDate()}
                </div>
                <div className="mt-2 space-y-1 max-h-28 overflow-y-auto">
                  {dayEvents.slice(0, 3).map(event => (
                    <EventItem key={event.id} event={event} />
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 text-center mt-1">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Calendar;
