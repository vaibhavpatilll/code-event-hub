
import React, { useState, useEffect } from 'react';
import { Event, fetchUpcomingEvents } from '@/services/eventApi';
import { formatDateDashed, formatTimeRange, formatEventDate } from '@/utils/dateUtils';
import { Calendar, Clock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const UpcomingEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      try {
        const upcomingEvents = await fetchUpcomingEvents(14); // Get events for the next 14 days
        setEvents(upcomingEvents);
      } catch (error) {
        console.error('Error loading upcoming events:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

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
    <div className="upcoming-events-container border-r border-gray-200 bg-gray-50 p-4">
      <h2 className="text-xl font-semibold mb-2">Upcoming Contests</h2>
      <p className="text-sm text-gray-500 mb-4">Don't miss scheduled events</p>
      
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-16 bg-gray-200 rounded mb-4"></div>
            </div>
          ))}
        </div>
      ) : (
        Object.entries(groupedEvents).map(([date, dateEvents]) => (
          <div key={date} className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">{date}</h3>
            
            {dateEvents.map(event => (
              <div key={event.id} className="bg-white shadow-sm rounded-md p-4 mb-3 border border-gray-100">
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
                        onClick={() => {
                          // This would trigger adding to personal calendar
                          // In a real app, this could use the browser's calendar API
                          alert(`Event "${event.title}" added to calendar`);
                        }}
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
