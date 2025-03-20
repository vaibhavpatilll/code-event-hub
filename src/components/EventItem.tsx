
import React from 'react';
import { ExternalLink, Clock } from 'lucide-react';
import { Event } from '@/services/eventApi';
import { formatTimeRange, formatDuration } from '@/utils/dateUtils';

interface EventItemProps {
  event: Event;
}

const EventItem: React.FC<EventItemProps> = ({ event }) => {
  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'leetcode':
        return 'bg-platform-leetcode';
      case 'codeforces':
        return 'bg-platform-codeforces';
      case 'codechef':
        return 'bg-platform-codechef';
      case 'atcoder':
        return 'bg-platform-atcoder';
      case 'hackerrank':
        return 'bg-platform-hackerrank';
      case 'gfg':
        return 'bg-platform-gfg';
      default:
        return 'bg-platform-default';
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

  return (
    <div className="event-item mb-1 group">
      <div className={`platform-indicator ${getPlatformColor(event.platform)}`} />
      <div className="pl-2">
        <h4 className="event-title">{event.title}</h4>
        <div className="event-time">
          <Clock className="h-3 w-3" />
          <span>{formatTimeRange(new Date(event.startTime), new Date(event.endTime))}</span>
        </div>
      </div>
      
      {/* Tooltip with more details */}
      <div className="event-tooltip">
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
        
        <a 
          href={event.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 transition-colors"
        >
          Visit website <ExternalLink className="h-3 w-3 ml-1" />
        </a>
      </div>
    </div>
  );
};

export default EventItem;
