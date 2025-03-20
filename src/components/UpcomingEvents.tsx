
import React, { useState, useEffect } from 'react';
import { Event, fetchUpcomingEvents } from '@/services/eventApi';
import { formatDateDashed, formatTimeRange, formatEventDate } from '@/utils/dateUtils';
import { Calendar, Clock, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const UpcomingEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const upcomingEvents = await fetchUpcomingEvents(14); // Get events for the next 14 days
        setEvents(upcomingEvents);
      } catch (error) {
        console.error('Error loading upcoming events:', error);
        setError('Failed to load upcoming events');
        toast.error('Failed to load upcoming events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Add to calendar functionality
  const addToCalendar = (event: Event) => {
    // Format dates for Google Calendar URL
    const startTime = event.startTime.toISOString().replace(/-|:|\.\d+/g, '');
    const endTime = event.endTime.toISOString().replace(/-|:|\.\d+/g, '');
    
    // Create Google Calendar URL
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(event.description || '')}&location=${encodeURIComponent(event.url)}`;
    
    // Open in a new tab
    window.open(url, '_blank');
    
    toast.success(`Added "${event.title}" to Google Calendar`);
  };

  // Group events by date
  const groupedEvents: { [key: string]: Event[] } = {};
  
  events.forEach(event => {
    const dateKey = formatEventDate(new Date(event.startTime));
    if (!groupedEvents[dateKey]) {
      groupedEvents[dateKey] = [];
    }
    groupedEvents[dateKey].push(event);
  });

  return (
    <div className="upcoming-events-container bg-gray-50 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-2">Upcoming Contests</h2>
      <p className="text-sm text-gray-500 mb-4">Don't miss scheduled events</p>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-sm text-gray-600">Loading upcoming contests...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500 mb-2">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline" 
            size="sm"
          >
            Retry
          </Button>
        </div>
      ) : Object.keys(groupedEvents).length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No upcoming contests found</p>
          <p className="text-sm mt-2">Check back later for new events</p>
        </div>
      ) : (
        Object.entries(groupedEvents).map(([date, dateEvents]) => (
          <div key={date} className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">{date}</h3>
            
            {dateEvents.map(event => (
              <div key={event.id} className="bg-white shadow-sm rounded-md p-4 mb-3 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-platform-default mt-2" style={{ 
                    backgroundColor: 
                      event.platform === 'leetcode' ? '#FFA116' :
                      event.platform === 'codeforces' ? '#318CE7' :
                      event.platform === 'codechef' ? '#5B4638' :
                      event.platform === 'atcoder' ? '#222222' :
                      event.platform === 'hackerrank' ? '#00EA64' :
                      event.platform === 'gfg' ? '#2F8D46' : '#6366F1'
                  }}></div>
                  <div className="flex-1">
                    <h4 className="font-medium text-base">{event.title}</h4>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTimeRange(new Date(event.startTime), new Date(event.endTime))}
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <Button 
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => addToCalendar(event)}
                      >
                        <Calendar className="h-3 w-3 mr-1" />
                        Add to Calendar
                      </Button>
                      <a 
                        href={event.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        Details
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default UpcomingEvents;
