
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

// Fallback data for when APIs fail
const getFallbackEvents = (platform: string): Event[] => {
  const now = new Date();
  const twoWeeksFromNow = new Date(now);
  twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
  
  switch (platform) {
    case 'leetcode':
      return [
        {
          id: 'lc-weekly-contest-341',
          title: 'LeetCode Weekly Contest 341',
          startTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
          endTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 1.5 * 60 * 60 * 1000), // 1.5 hours duration
          url: 'https://leetcode.com/contest/',
          platform: 'leetcode',
          description: 'LeetCode weekly contest with 4 algorithmic problems to solve in 1.5 hours.'
        },
        {
          id: 'lc-biweekly-contest-102',
          title: 'LeetCode Biweekly Contest 102',
          startTime: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
          endTime: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000 + 1.5 * 60 * 60 * 1000), // 1.5 hours duration
          url: 'https://leetcode.com/contest/',
          platform: 'leetcode',
          description: 'LeetCode biweekly contest with 4 algorithmic problems to solve in 1.5 hours.'
        }
      ];
    case 'codechef':
      return [
        {
          id: 'cc-long-challenge',
          title: 'CodeChef Long Challenge',
          startTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
          endTime: new Date(now.getTime() + 13 * 24 * 60 * 60 * 1000), // 10 days duration
          url: 'https://www.codechef.com/contests',
          platform: 'codechef',
          description: 'CodeChef monthly long challenge with 8-10 problems to be solved over 10 days.'
        },
        {
          id: 'cc-cook-off',
          title: 'CodeChef Cook-Off',
          startTime: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000), // 8 days from now
          endTime: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000 + 2.5 * 60 * 60 * 1000), // 2.5 hours duration
          url: 'https://www.codechef.com/contests',
          platform: 'codechef',
          description: 'CodeChef Cook-Off contest with 5 problems to solve in 2.5 hours.'
        }
      ];
    case 'atcoder':
      return [
        {
          id: 'ac-regular-contest-140',
          title: 'AtCoder Regular Contest 140',
          startTime: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
          endTime: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours duration
          url: 'https://atcoder.jp/contests',
          platform: 'atcoder',
          description: 'AtCoder Regular Contest with 6 problems of medium-high difficulty.'
        },
        {
          id: 'ac-beginner-contest-290',
          title: 'AtCoder Beginner Contest 290',
          startTime: new Date(now.getTime() + 11 * 24 * 60 * 60 * 1000), // 11 days from now
          endTime: new Date(now.getTime() + 11 * 24 * 60 * 60 * 1000 + 1.75 * 60 * 60 * 1000), // 1.75 hours duration
          url: 'https://atcoder.jp/contests',
          platform: 'atcoder',
          description: 'AtCoder Beginner Contest with 6 problems of varying difficulty suitable for beginners.'
        }
      ];
    case 'hackerrank':
      return [
        {
          id: 'hr-hack-the-interview',
          title: 'HackerRank Hack the Interview',
          startTime: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
          endTime: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 3 hours duration
          url: 'https://www.hackerrank.com/contests',
          platform: 'hackerrank',
          description: 'HackerRank contest with problems designed to simulate technical interviews.'
        },
        {
          id: 'hr-weekly-challenges',
          title: 'HackerRank Weekly Challenges',
          startTime: new Date(now.getTime() + 9 * 24 * 60 * 60 * 1000), // 9 days from now
          endTime: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // 1 day duration
          url: 'https://www.hackerrank.com/contests',
          platform: 'hackerrank',
          description: 'Weekly programming challenges on HackerRank.'
        }
      ];
    case 'gfg':
      return [
        {
          id: 'gfg-coding-competition',
          title: 'GeeksforGeeks Coding Competition',
          startTime: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          endTime: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours duration
          url: 'https://practice.geeksforgeeks.org/contests',
          platform: 'gfg',
          description: 'GeeksforGeeks contest focused on DSA problems.'
        },
        {
          id: 'gfg-interview-series',
          title: 'GeeksforGeeks Interview Series',
          startTime: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
          endTime: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 3 hours duration
          url: 'https://practice.geeksforgeeks.org/contests',
          platform: 'gfg',
          description: 'GeeksforGeeks contest with problems commonly asked in technical interviews.'
        }
      ];
    default:
      return [];
  }
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
    console.error("Error in Codeforces API response: Status not OK");
    return getFallbackEvents('codeforces');
  } catch (error) {
    console.error("Error fetching Codeforces events:", error);
    return getFallbackEvents('codeforces');
  }
};

// LeetCode API calls (using Kontests API as proxy since LeetCode doesn't have a public API)
const fetchLeetCodeEvents = async (): Promise<Event[]> => {
  try {
    const response = await fetch('https://kontests.net/api/v1/leet_code');
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
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
    return getFallbackEvents('leetcode');
  }
};

// CodeChef API calls (using Kontests API)
const fetchCodeChefEvents = async (): Promise<Event[]> => {
  try {
    const response = await fetch('https://kontests.net/api/v1/code_chef');
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
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
    return getFallbackEvents('codechef');
  }
};

// AtCoder API calls (using Kontests API)
const fetchAtCoderEvents = async (): Promise<Event[]> => {
  try {
    const response = await fetch('https://kontests.net/api/v1/at_coder');
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
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
    return getFallbackEvents('atcoder');
  }
};

// HackerRank API calls (using Kontests API)
const fetchHackerRankEvents = async (): Promise<Event[]> => {
  try {
    const response = await fetch('https://kontests.net/api/v1/hacker_rank');
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
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
    return getFallbackEvents('hackerrank');
  }
};

// GeeksforGeeks API calls (using Kontests API)
const fetchGFGEvents = async (): Promise<Event[]> => {
  try {
    // For GFG, we might need to filter from a general list
    const response = await fetch('https://kontests.net/api/v1/all');
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
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
    return getFallbackEvents('gfg');
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
        
        // Add fallback data for failed platform
        const fallbackData = getFallbackEvents(
          ['codeforces', 'leetcode', 'codechef', 'atcoder', 'hackerrank', 'gfg'][index]
        );
        allEvents = [...allEvents, ...fallbackData];
        
        // Show info toast that we're using fallback data
        toast.info(`Using sample data for ${platforms[index]} due to API issues.`);
      }
    });
    
    // Sort all events by start time
    allEvents.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    
    return allEvents;
  } catch (error) {
    console.error("Error fetching events:", error);
    toast.error("Failed to fetch events. Please try again later.");
    
    // Return fallback data for all platforms if everything fails
    const fallbackData = [
      ...getFallbackEvents('codeforces'),
      ...getFallbackEvents('leetcode'),
      ...getFallbackEvents('codechef'),
      ...getFallbackEvents('atcoder'),
      ...getFallbackEvents('hackerrank'),
      ...getFallbackEvents('gfg')
    ];
    
    return fallbackData.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
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
    
    if (events.length === 0) {
      // If no events were returned, use fallback data
      events = getFallbackEvents(platform);
      toast.info(`Using sample data for ${platform} due to API issues.`);
    }
    
    return events.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  } catch (error) {
    console.error(`Error fetching ${platform} events:`, error);
    toast.error(`Failed to fetch ${platform} events. Using sample data instead.`);
    
    // Return fallback data for this platform
    return getFallbackEvents(platform);
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
    toast.error("Failed to fetch upcoming events. Using sample data instead.");
    
    // Return fallback data for all platforms but only upcoming ones
    const fallbackData = [
      ...getFallbackEvents('codeforces'),
      ...getFallbackEvents('leetcode'),
      ...getFallbackEvents('codechef'),
      ...getFallbackEvents('atcoder'),
      ...getFallbackEvents('hackerrank'),
      ...getFallbackEvents('gfg')
    ];
    
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + days);
    
    return fallbackData
      .filter(event => event.startTime >= now && event.startTime <= futureDate)
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  }
};

