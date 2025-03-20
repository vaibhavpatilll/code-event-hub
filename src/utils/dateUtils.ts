
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, startOfDay, endOfDay, isSameDay } from 'date-fns';
import { Event } from '@/services/eventApi';

// Format a date as "March 2023"
export const formatMonthYear = (date: Date): string => {
  return format(date, 'MMMM yyyy');
};

// Format a date as "Mar 21, 2023"
export const formatReadableDate = (date: Date): string => {
  return format(date, 'MMM dd, yyyy');
};

// Format a time as "14:30"
export const formatTime = (date: Date): string => {
  return format(date, 'HH:mm');
};

// Format a date as "21-03-2023"
export const formatDateDashed = (date: Date): string => {
  return format(date, 'dd-MM-yyyy');
};

// Get the next month
export const getNextMonth = (date: Date): Date => {
  return addMonths(date, 1);
};

// Get the previous month
export const getPrevMonth = (date: Date): Date => {
  return subMonths(date, 1);
};

// Get all days in a month
export const getDaysInMonth = (date: Date): Date[] => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return eachDayOfInterval({ start, end });
};

// Check if a date is in the current month
export const isCurrentMonth = (date: Date, currentMonth: Date): boolean => {
  return isSameMonth(date, currentMonth);
};

// Check if a date is today
export const isCurrentDay = (date: Date): boolean => {
  return isToday(date);
};

// Get events for a specific day
export const getEventsForDay = (date: Date, events: Event[]): Event[] => {
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);
  
  return events.filter(event => {
    const eventStart = new Date(event.startTime);
    return eventStart >= dayStart && eventStart <= dayEnd;
  });
};

// Check if an event starts on a specific day
export const eventStartsOnDay = (event: Event, date: Date): boolean => {
  return isSameDay(new Date(event.startTime), date);
};

// Format duration between two dates
export const formatDuration = (startTime: Date, endTime: Date): string => {
  const durationMs = endTime.getTime() - startTime.getTime();
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`;
  }
  return `${minutes}m`;
};

// Format the time range for an event
export const formatTimeRange = (startTime: Date, endTime: Date): string => {
  return `${format(startTime, 'HH:mm')} - ${format(endTime, 'HH:mm')}`;
};

// Format a date for display in the upcoming events list
export const formatEventDate = (date: Date): string => {
  if (isToday(date)) {
    return 'Today';
  }
  return format(date, 'MM/dd/yyyy');
};
