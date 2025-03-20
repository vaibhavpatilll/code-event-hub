
import React, { useState, useEffect } from 'react';
import { getDaysInMonth, isCurrentMonth, isCurrentDay, getEventsForDay } from '@/utils/dateUtils';
import { Event, fetchAllEvents } from '@/services/eventApi';
import CalendarHeader from './CalendarHeader';
import EventItem from './EventItem';

const Calendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Days of the week for the header
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Fetch events when the component mounts
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      try {
        const allEvents = await fetchAllEvents();
        setEvents(allEvents);
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

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

  return (
    <div className="calendar-container">
      <CalendarHeader 
        currentMonth={currentMonth} 
        prevMonth={prevMonth} 
        nextMonth={nextMonth} 
      />
      
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
          const dayEvents = getEventsForDay(day, events);
          const isToday = isCurrentDay(day);
          
          return (
            <div 
              key={day.toString()} 
              className={`date-cell ${isToday ? 'today-highlight' : ''}`}
            >
              <div className="date-number">{day.getDate()}</div>
              <div className="mt-5 space-y-1">
                {loading ? (
                  <div className="animate-pulse h-8 bg-gray-200 rounded"></div>
                ) : (
                  dayEvents.map(event => (
                    <EventItem key={event.id} event={event} />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
