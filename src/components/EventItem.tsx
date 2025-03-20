
import React from 'react';
import { ExternalLink, Clock, Calendar } from 'lucide-react';
import { Event } from '@/services/eventApi';
import { formatTimeRange, formatDuration } from '@/utils/dateUtils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';

interface EventItemProps {
  event: Event;
}

const EventItem: React.FC<EventItemProps> = ({ event }) => {
  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'leetcode':
        return 'bg-[#FFA116]';
      case 'codeforces':
        return 'bg-[#318CE7]';
      case 'codechef':
        return 'bg-[#5B4638]';
      case 'atcoder':
        return 'bg-[#222222]';
      case 'hackerrank':
        return 'bg-[#00EA64]';
      case 'gfg':
        return 'bg-[#2F8D46]';
      default:
        return 'bg-gray-500';
    }
  };

  const getPlatformName = (platform: string) => {
    switch (platform) {
      case 'leetcode':
        return 'LeetCode';
      case 'codeforces':
        return 'Codeforces';
      case 'codechef':
        return 'CodeChef';
      case 'atcoder':
        return 'AtCoder';
      case 'hackerrank':
        return 'HackerRank';
      case 'gfg':
        return 'GeeksforGeeks';
      default:
        return 'Other';
    }
  };

  const addToCalendar = () => {
    // Format dates for Google Calendar URL
    const startTime = event.startTime.toISOString().replace(/-|:|\.\d+/g, '');
    const endTime = event.endTime.toISOString().replace(/-|:|\.\d+/g, '');
    
    // Create Google Calendar URL
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(event.description || '')}&location=${encodeURIComponent(event.url)}`;
    
    // Open in a new tab
    window.open(url, '_blank');
    
    toast.success(`Added "${event.title}" to Google Calendar`);
  };

  // Calculate if the event is happening today
  const isToday = () => {
    const today = new Date();
    const eventDate = new Date(event.startTime);
    return (
      today.getDate() === eventDate.getDate() &&
      today.getMonth() === eventDate.getMonth() &&
      today.getFullYear() === eventDate.getFullYear()
    );
  };

  // Calculate if the event is happening soon (within 24 hours)
  const isSoon = () => {
    const now = new Date();
    const eventTime = new Date(event.startTime);
    const timeDiff = eventTime.getTime() - now.getTime();
    return timeDiff > 0 && timeDiff < 24 * 60 * 60 * 1000;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="event-item text-left p-1 rounded-sm border-l-2 hover:bg-gray-50 cursor-pointer truncate flex items-start gap-1" 
            style={{ borderLeftColor: 
              event.platform === 'leetcode' ? '#FFA116' :
              event.platform === 'codeforces' ? '#318CE7' :
              event.platform === 'codechef' ? '#5B4638' :
              event.platform === 'atcoder' ? '#222222' :
              event.platform === 'hackerrank' ? '#00EA64' :
              event.platform === 'gfg' ? '#2F8D46' : '#6366F1'
            }}
          >
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-medium truncate">{event.title}</h4>
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="h-2 w-2 mr-1" />
                <span className="truncate">{formatTimeRange(new Date(event.startTime), new Date(event.endTime))}</span>
              </div>
            </div>
            {(isToday() || isSoon()) && (
              <span className="h-2 w-2 rounded-full bg-red-500 flex-shrink-0 mt-1" />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent className="w-64 p-4">
          <h3 className="font-semibold text-base mb-1">{event.title}</h3>
          <div className="text-xs text-gray-500 mb-2">
            <span className={`inline-block w-2 h-2 rounded-full mr-1 ${getPlatformColor(event.platform)}`}></span>
            {getPlatformName(event.platform)}
          </div>
          
          <div className="text-sm mb-2">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-gray-500" />
              <span>{formatTimeRange(new Date(event.startTime), new Date(event.endTime))}</span>
            </div>
            <div className="text-gray-500 text-xs mt-1">
              Duration: {formatDuration(new Date(event.startTime), new Date(event.endTime))}
            </div>
          </div>
          
          {event.description && (
            <p className="text-sm text-gray-600 mb-2">{event.description}</p>
          )}
          
          <div className="flex justify-between items-center mt-3">
            <button 
              onClick={addToCalendar}
              className="text-xs text-gray-600 hover:text-gray-800 flex items-center"
            >
              <Calendar className="h-3 w-3 mr-1" />
              Add to Calendar
            </button>
            <a 
              href={event.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              Visit website <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default EventItem;
