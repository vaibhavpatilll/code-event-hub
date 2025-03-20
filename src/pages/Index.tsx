
import React, { useState, useEffect } from 'react';
import Calendar from '@/components/Calendar';
import UpcomingEvents from '@/components/UpcomingEvents';
import SearchBar from '@/components/SearchBar';
import PlatformFilter from '@/components/PlatformFilter';
import { Event, fetchAllEvents } from '@/services/eventApi';
import { toast } from 'sonner';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    'leetcode',
    'codeforces',
    'codechef',
    'atcoder',
    'hackerrank',
    'gfg',
  ]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFallbackNotice, setShowFallbackNotice] = useState<boolean>(false);
  const [platformsUsingFallback, setPlatformsUsingFallback] = useState<string[]>([]);

  // Fetch all events when the component mounts
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchAllEvents();
        setAllEvents(result.events);
        setFilteredEvents(result.events);
        setShowFallbackNotice(result.usingFallback);
        setPlatformsUsingFallback(result.platformsUsingFallback);
        
        toast.success(`Loaded ${result.events.length} contests from all platforms`);
        
        if (result.usingFallback) {
          const platformNames = result.platformsUsingFallback.map(getPlatformDisplayName).join(', ');
          toast.info(`Using demo data for: ${platformNames}`);
        }
      } catch (error) {
        console.error('Error loading events:', error);
        setError('Failed to load events. Please try refreshing the page.');
        toast.error('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Filter events when search query or selected platforms change
  useEffect(() => {
    const filtered = allEvents.filter(event => {
      const matchesPlatform = selectedPlatforms.includes(event.platform);
      const matchesSearch = searchQuery === '' || 
        event.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesPlatform && matchesSearch;
    });
    
    setFilteredEvents(filtered);
  }, [searchQuery, selectedPlatforms, allEvents]);

  // Handle platform filter change
  const handlePlatformChange = (platform: string) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(platform)) {
        return prev.filter(p => p !== platform);
      } else {
        return [...prev, platform];
      }
    });
  };

  // Handle search query change
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Handle refresh
  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchAllEvents();
      setAllEvents(result.events);
      setFilteredEvents(result.events);
      setShowFallbackNotice(result.usingFallback);
      setPlatformsUsingFallback(result.platformsUsingFallback);
      
      toast.success('Successfully refreshed contests data');
      
      if (result.usingFallback) {
        const platformNames = result.platformsUsingFallback.map(getPlatformDisplayName).join(', ');
        toast.info(`Using demo data for: ${platformNames}`);
      }
    } catch (error) {
      console.error('Error refreshing events:', error);
      setError('Failed to refresh events data');
      toast.error('Failed to refresh events data');
    } finally {
      setLoading(false);
    }
  };

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
    <div className="min-h-screen bg-white">
      <div className="container mx-auto pt-8 pb-16 px-4">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Coding Contest Calendar</h1>
          <p className="text-gray-600 mt-2">Track upcoming contests from all major coding platforms</p>
        </header>
        
        {showFallbackNotice && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Some platform APIs are currently unavailable</p>
                <p className="text-sm mt-1">Using sample data for: {platformsUsingFallback.map(getPlatformDisplayName).join(', ')}</p>
                <p className="text-xs mt-1">Note: Some coding platforms block API requests from browsers due to CORS restrictions. For fully functional production use, you would need a backend proxy.</p>
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
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Upcoming Events */}
          <div className="lg:col-span-1">
            <UpcomingEvents />
          </div>
          
          {/* Main Content - Calendar */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <SearchBar onSearch={handleSearch} />
                <PlatformFilter
                  selectedPlatforms={selectedPlatforms}
                  onPlatformChange={handlePlatformChange}
                />
              </div>
              
              <Calendar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
