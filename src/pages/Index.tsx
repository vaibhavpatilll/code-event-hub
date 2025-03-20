
import React, { useState, useEffect } from 'react';
import Calendar from '@/components/Calendar';
import UpcomingEvents from '@/components/UpcomingEvents';
import SearchBar from '@/components/SearchBar';
import PlatformFilter from '@/components/PlatformFilter';
import { Event, fetchAllEvents } from '@/services/eventApi';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

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

  // Fetch all events when the component mounts
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const events = await fetchAllEvents();
        setAllEvents(events);
        setFilteredEvents(events);
        toast.success(`Loaded ${events.length} contests from all platforms`);
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
      const events = await fetchAllEvents();
      setAllEvents(events);
      setFilteredEvents(events);
      toast.success('Successfully refreshed contests data');
    } catch (error) {
      console.error('Error refreshing events:', error);
      setError('Failed to refresh events data');
      toast.error('Failed to refresh events data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto pt-8 pb-16 px-4">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Coding Contest Calendar</h1>
          <p className="text-gray-600 mt-2">Track upcoming contests from all major coding platforms</p>
        </header>
        
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
              
              {loading ? (
                <div className="flex flex-col items-center justify-center h-96">
                  <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
                  <p className="text-xl text-gray-600">Loading contests from all platforms...</p>
                  <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-96">
                  <p className="text-xl text-red-500 mb-4">{error}</p>
                  <button 
                    onClick={handleRefresh} 
                    className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                  >
                    Refresh
                  </button>
                </div>
              ) : (
                <Calendar />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
