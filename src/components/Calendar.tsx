
import React, { useState, useEffect } from 'react';
import { getDaysInMonth, isCurrentDay, getEventsForDay } from '@/utils/dateUtils';
import { Event, fetchAllEvents } from '@/services/eventApi';
import CalendarHeader from './CalendarHeader';
import EventItem from './EventItem';
import { toast } from 'sonner';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Calendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showFallbackNotice, setShowFallbackNotice] = useState<boolean>(false);
  const [platformsWithFallbackData, setPlatformsWithFallbackData] = useState<string[]>([]);

  // Days of the week for the header
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Fetch events when the component mounts or month changes
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchResult = await fetchAllEvents();
        setEvents(fetchResult.events);
        
        // Check if we're using fallback data and which platforms are affected
        setShowFallbackNotice(fetchResult.usingFallback);
        setPlatformsWithFallbackData(fetchResult.platformsUsingFallback || []);
        
        console.log('Calendar loaded events:', fetchResult.events.length);
        console.log('Using fallback data for platforms:', fetchResult.platformsUsingFallback);
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

  // Refresh events
  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchResult = await fetchAllEvents();
      setEvents(fetchResult.events);
      setShowFallbackNotice(fetchResult.usingFallback);
      setPlatformsWithFallbackData(fetchResult.platformsUsingFallback || []);
      toast.success('Successfully refreshed calendar data');
    } catch (error) {
      console.error('Error refreshing events:', error);
      setError('Failed to refresh events data');
      toast.error('Failed to refresh events data');
    } finally {
      setLoading(false);
    }
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

  const getPlatformDisplayName = (id: string): string => {
    const platformMap: Record<string, string> = {
      'leetcode': 'LeetCode',
      'codeforces': 'Codeforces',
      'codechef': 'CodeChef',
      'atcoder': 'AtCoder',
      'hackerrank': 'HackerRank',
      'gfg': 'GeeksforGeeks'
    };
    return platformMap[id] || id;
  };

  return (
    <div className="calendar-container">
      <CalendarHeader 
        currentMonth={currentMonth} 
        prevMonth={prevMonth} 
        nextMonth={nextMonth} 
      />
      
      {showFallbackNotice && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Some platform APIs are currently unavailable</p>
              <p className="text-sm mt-1">Using sample data for: {platformsWithFallbackData.map(getPlatformDisplayName).join(', ')}</p>
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefresh} 
                  className="text-sm"
                >
                  Retry API Calls
                </Button>
              </div>
            </div>
          </div>
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
          <Button 
            onClick={handleRefresh} 
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Retry
          </Button>
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
