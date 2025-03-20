
import React, { useState, useEffect } from 'react';
import Calendar from '@/components/Calendar';
import UpcomingEvents from '@/components/UpcomingEvents';
import SearchBar from '@/components/SearchBar';
import PlatformFilter from '@/components/PlatformFilter';
import { Event, fetchAllEvents } from '@/services/eventApi';
import { toast } from 'sonner';

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

  // Fetch all events when the component mounts
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      try {
        const events = await fetchAllEvents();
        setAllEvents(events);
        setFilteredEvents(events);
      } catch (error) {
        console.error('Error loading events:', error);
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

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto pt-8 pb-16 px-4">
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
                <div className="animate-pulse space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-80 bg-gray-200 rounded"></div>
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
