
import { toast } from "sonner";

// Event interface
export interface Event {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  url: string;
  platform: 'leetcode' | 'codeforces' | 'codechef' | 'atcoder' | 'hackerrank' | 'gfg' | 'other';
  description?: string;
}

// Helper function to parse the duration from string like "01:30" to milliseconds
const parseDuration = (duration: string): number => {
  const [hours, minutes] = duration.split(':').map(Number);
  return (hours * 60 + minutes) * 60 * 1000;
};

// Create a date from a string in ISO format or timestamp
const createDate = (dateStr: string | number): Date => {
  return new Date(dateStr);
};

// Codeforces API calls
const fetchCodeforcesEvents = async (): Promise<Event[]> => {
  try {
    const response = await fetch('https://codeforces.com/api/contest.list');
    const data = await response.json();
    
    if (data.status === 'OK') {
      return data.result
        .filter((contest: any) => contest.phase === 'BEFORE')
        .map((contest: any) => ({
          id: `cf-${contest.id}`,
          title: contest.name,
          startTime: new Date(contest.startTimeSeconds * 1000),
          endTime: new Date((contest.startTimeSeconds + contest.durationSeconds) * 1000),
          url: `https://codeforces.com/contests/${contest.id}`,
          platform: 'codeforces',
          description: `Codeforces contest with duration of ${Math.floor(contest.durationSeconds / 3600)} hours.`
        }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching Codeforces events:", error);
    return [];
  }
};

// LeetCode API calls (using Kontests API as proxy since LeetCode doesn't have a public API)
const fetchLeetCodeEvents = async (): Promise<Event[]> => {
  try {
    const response = await fetch('https://kontests.net/api/v1/leet_code');
    const contests = await response.json();
    
    return contests.map((contest: any) => ({
      id: `lc-${contest.name.replace(/\s+/g, '-').toLowerCase()}`,
      title: contest.name,
      startTime: new Date(contest.start_time),
      endTime: new Date(contest.end_time),
      url: contest.url,
      platform: 'leetcode',
      description: `LeetCode contest with duration of ${contest.duration}.`
    }));
  } catch (error) {
    console.error("Error fetching LeetCode events:", error);
    return [];
  }
};

// CodeChef API calls (using Kontests API)
const fetchCodeChefEvents = async (): Promise<Event[]> => {
  try {
    const response = await fetch('https://kontests.net/api/v1/code_chef');
    const contests = await response.json();
    
    return contests.map((contest: any) => ({
      id: `cc-${contest.name.replace(/\s+/g, '-').toLowerCase()}`,
      title: contest.name,
      startTime: new Date(contest.start_time),
      endTime: new Date(contest.end_time),
      url: contest.url,
      platform: 'codechef',
      description: `CodeChef contest with a duration of ${contest.duration}.`
    }));
  } catch (error) {
    console.error("Error fetching CodeChef events:", error);
    return [];
  }
};

// AtCoder API calls (using Kontests API)
const fetchAtCoderEvents = async (): Promise<Event[]> => {
  try {
    const response = await fetch('https://kontests.net/api/v1/at_coder');
    const contests = await response.json();
    
    return contests.map((contest: any) => ({
      id: `ac-${contest.name.replace(/\s+/g, '-').toLowerCase()}`,
      title: contest.name,
      startTime: new Date(contest.start_time),
      endTime: new Date(contest.end_time),
      url: contest.url,
      platform: 'atcoder',
      description: `AtCoder contest with a duration of ${contest.duration}.`
    }));
  } catch (error) {
    console.error("Error fetching AtCoder events:", error);
    return [];
  }
};

// HackerRank API calls (using Kontests API)
const fetchHackerRankEvents = async (): Promise<Event[]> => {
  try {
    const response = await fetch('https://kontests.net/api/v1/hacker_rank');
    const contests = await response.json();
    
    return contests.map((contest: any) => ({
      id: `hr-${contest.name.replace(/\s+/g, '-').toLowerCase()}`,
      title: contest.name,
      startTime: new Date(contest.start_time),
      endTime: new Date(contest.end_time),
      url: contest.url,
      platform: 'hackerrank',
      description: `HackerRank contest with a duration of ${contest.duration}.`
    }));
  } catch (error) {
    console.error("Error fetching HackerRank events:", error);
    return [];
  }
};

// GeeksforGeeks API calls (using Kontests API)
const fetchGFGEvents = async (): Promise<Event[]> => {
  try {
    // For GFG, we might need to filter from a general list
    const response = await fetch('https://kontests.net/api/v1/all');
    const contests = await response.json();
    
    return contests
      .filter((contest: any) => contest.site === "GeeksforGeeks")
      .map((contest: any) => ({
        id: `gfg-${contest.name.replace(/\s+/g, '-').toLowerCase()}`,
        title: contest.name,
        startTime: new Date(contest.start_time),
        endTime: new Date(contest.end_time),
        url: contest.url,
        platform: 'gfg',
        description: `GeeksforGeeks contest with a duration of ${contest.duration}.`
      }));
  } catch (error) {
    console.error("Error fetching GFG events:", error);
    return [];
  }
};

// API to fetch events from all platforms
export const fetchAllEvents = async (): Promise<Event[]> => {
  try {
    toast.info("Fetching contests from all platforms...");
    
    // Run all API calls in parallel for better performance
    const results = await Promise.allSettled([
      fetchCodeforcesEvents(),
      fetchLeetCodeEvents(),
      fetchCodeChefEvents(),
      fetchAtCoderEvents(),
      fetchHackerRankEvents(),
      fetchGFGEvents()
    ]);
    
    // Process the results and combine all events
    let allEvents: Event[] = [];
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allEvents = [...allEvents, ...result.value];
      } else {
        // Log the error but don't fail the entire operation
        const platforms = ['Codeforces', 'LeetCode', 'CodeChef', 'AtCoder', 'HackerRank', 'GeeksforGeeks'];
        console.error(`Error fetching data from ${platforms[index]}:`, result.reason);
      }
    });
    
    // Sort all events by start time
    allEvents.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    
    return allEvents;
  } catch (error) {
    console.error("Error fetching events:", error);
    toast.error("Failed to fetch events. Please try again later.");
    return [];
  }
};

// API to fetch events from a specific platform
export const fetchPlatformEvents = async (platform: string): Promise<Event[]> => {
  try {
    toast.info(`Fetching ${platform} contests...`);
    
    let events: Event[] = [];
    
    switch (platform) {
      case 'codeforces':
        events = await fetchCodeforcesEvents();
        break;
      case 'leetcode':
        events = await fetchLeetCodeEvents();
        break;
      case 'codechef':
        events = await fetchCodeChefEvents();
        break;
      case 'atcoder':
        events = await fetchAtCoderEvents();
        break;
      case 'hackerrank':
        events = await fetchHackerRankEvents();
        break;
      case 'gfg':
        events = await fetchGFGEvents();
        break;
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
    
    return events.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  } catch (error) {
    console.error(`Error fetching ${platform} events:`, error);
    toast.error(`Failed to fetch ${platform} events. Please try again later.`);
    return [];
  }
};

// Fetch upcoming events for today and next few days
export const fetchUpcomingEvents = async (days: number = 7): Promise<Event[]> => {
  try {
    const allEvents = await fetchAllEvents();
    
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + days);
    
    return allEvents.filter(event => {
      return event.startTime >= now && event.startTime <= futureDate;
    }).sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    toast.error("Failed to fetch upcoming events. Please try again later.");
    return [];
  }
};
