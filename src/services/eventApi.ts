
import { toast } from "sonner";

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

// Helper to create a date from a string in ISO format
const createDate = (dateStr: string): Date => {
  return new Date(dateStr);
};

// Mock data - in a real app, this would come from API calls
const mockEvents: Event[] = [
  // Today
  {
    id: "cf-div2-1",
    title: "Codeforces Round (Div. 2)",
    startTime: new Date(new Date().setHours(20, 0, 0, 0)),
    endTime: new Date(new Date().setHours(22, 0, 0, 0)),
    url: "https://codeforces.com/contests",
    platform: "codeforces",
    description: "Participate in Codeforces Round (Div. 2) and compete globally with programmers around the world."
  },
  {
    id: "lc-biweekly-1",
    title: "LeetCode Biweekly Contest",
    startTime: new Date(new Date().setHours(21, 30, 0, 0)),
    endTime: new Date(new Date().setHours(23, 30, 0, 0)),
    url: "https://leetcode.com/contest/",
    platform: "leetcode",
    description: "Solve algorithmic problems in LeetCode's Biweekly Contest and improve your problem-solving skills."
  },
  
  // Tomorrow
  {
    id: "cc-cookoff-1",
    title: "CodeChef Cook-Off",
    startTime: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(19, 30, 0, 0)),
    endTime: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(22, 0, 0, 0)),
    url: "https://www.codechef.com/contests",
    platform: "codechef",
    description: "CodeChef's Cook-Off is a 2.5 hour coding competition held towards the end of the month."
  },
  
  // Next week
  {
    id: "at-regular-1",
    title: "AtCoder Regular Contest",
    startTime: new Date(new Date(new Date().setDate(new Date().getDate() + 7)).setHours(17, 0, 0, 0)),
    endTime: new Date(new Date(new Date().setDate(new Date().getDate() + 7)).setHours(19, 0, 0, 0)),
    url: "https://atcoder.jp/contests",
    platform: "atcoder",
    description: "AtCoder Regular Contest (ARC) is a rated competition for intermediate programmers (Div. 2)."
  },
  {
    id: "lc-weekly-1",
    title: "LeetCode Weekly Contest",
    startTime: new Date(new Date(new Date().setDate(new Date().getDate() + 7)).setHours(10, 30, 0, 0)),
    endTime: new Date(new Date(new Date().setDate(new Date().getDate() + 7)).setHours(12, 30, 0, 0)),
    url: "https://leetcode.com/contest/",
    platform: "leetcode",
    description: "Put your coding skills to the test in this 90-minute contest featuring 4 algorithmic problems."
  },
  
  // Two weeks from now
  {
    id: "hr-weekofcode-1",
    title: "HackerRank Week of Code",
    startTime: new Date(new Date(new Date().setDate(new Date().getDate() + 14)).setHours(14, 0, 0, 0)),
    endTime: new Date(new Date(new Date().setDate(new Date().getDate() + 21)).setHours(14, 0, 0, 0)),
    url: "https://www.hackerrank.com/contests",
    platform: "hackerrank",
    description: "A week-long coding contest featuring multiple algorithmic challenges."
  },
  {
    id: "gfg-coding-1",
    title: "GeeksforGeeks Coding Contest",
    startTime: new Date(new Date(new Date().setDate(new Date().getDate() + 16)).setHours(20, 0, 0, 0)),
    endTime: new Date(new Date(new Date().setDate(new Date().getDate() + 16)).setHours(23, 0, 0, 0)),
    url: "https://practice.geeksforgeeks.org/contest/",
    platform: "gfg",
    description: "Test your skills with problems ranging from easy to hard in this GFG contest."
  },
  
  // Three weeks from now
  {
    id: "cf-educational-1",
    title: "Educational Codeforces Round",
    startTime: new Date(new Date(new Date().setDate(new Date().getDate() + 21)).setHours(17, 35, 0, 0)),
    endTime: new Date(new Date(new Date().setDate(new Date().getDate() + 21)).setHours(19, 35, 0, 0)),
    url: "https://codeforces.com/contests",
    platform: "codeforces",
    description: "Educational rounds feature problems that teach specific algorithms and techniques."
  },
  
  // Current month various events
  {
    id: "job-a-thon-43",
    title: "Job-A-thon 43 Hiring Challenge",
    startTime: new Date(new Date(new Date().setDate(new Date().getDate() + 2)).setHours(8, 0, 0, 0)),
    endTime: new Date(new Date(new Date().setDate(new Date().getDate() + 2)).setHours(10, 30, 0, 0)),
    url: "https://practice.geeksforgeeks.org/contest/",
    platform: "gfg",
    description: "Participate in GFG's hiring contest and get a chance to be interviewed by top companies."
  },
  {
    id: "unique-vision-2025",
    title: "UNIQUE VISION Programming Contest 2025",
    startTime: new Date(new Date(new Date().setDate(new Date().getDate() + 5)).setHours(17, 30, 0, 0)),
    endTime: new Date(new Date(new Date().setDate(new Date().getDate() + 5)).setHours(19, 10, 0, 0)),
    url: "https://atcoder.jp/contests",
    platform: "atcoder",
    description: "UNIQUE VISION sponsors this programming contest on the AtCoder platform."
  },
  {
    id: "starters-175",
    title: "Starters 175",
    startTime: new Date(new Date(new Date().setDate(new Date().getDate() + 10)).setHours(20, 0, 0, 0)),
    endTime: new Date(new Date(new Date().setDate(new Date().getDate() + 10)).setHours(23, 0, 0, 0)),
    url: "https://www.codechef.com/contests",
    platform: "codechef",
    description: "CodeChef Starters is a rated contest for programmers of all levels."
  },
  {
    id: "weekly-contest-442",
    title: "Weekly Contest 442",
    startTime: new Date(new Date(new Date().setDate(new Date().getDate() + 12)).setHours(8, 0, 0, 0)),
    endTime: new Date(new Date(new Date().setDate(new Date().getDate() + 12)).setHours(9, 30, 0, 0)),
    url: "https://leetcode.com/contest/",
    platform: "leetcode",
    description: "Join LeetCode's weekly coding competition featuring 4 algorithmic challenges."
  },
  {
    id: "omron-contest",
    title: "OMRON Programming Contest 2024",
    startTime: new Date(new Date(new Date().setDate(new Date().getDate() + 18)).setHours(13, 0, 0, 0)),
    endTime: new Date(new Date(new Date().setDate(new Date().getDate() + 18)).setHours(15, 0, 0, 0)),
    url: "https://atcoder.jp/contests",
    platform: "atcoder",
    description: "Sponsored by OMRON, this contest features interesting problems based on industrial applications."
  },
  // Add more mock events to cover a full month
];

// API to fetch events from all platforms
export const fetchAllEvents = async (): Promise<Event[]> => {
  try {
    // In a real app, you would make API calls to different platforms here
    // For now, we'll return mock data
    return mockEvents;
  } catch (error) {
    console.error("Error fetching events:", error);
    toast.error("Failed to fetch events. Please try again later.");
    return [];
  }
};

// API to fetch events from a specific platform
export const fetchPlatformEvents = async (platform: string): Promise<Event[]> => {
  try {
    // In a real app, you would make an API call to the specific platform
    // For now, we'll filter the mock data
    return mockEvents.filter(event => event.platform === platform);
  } catch (error) {
    console.error(`Error fetching ${platform} events:`, error);
    toast.error(`Failed to fetch ${platform} events. Please try again later.`);
    return [];
  }
};

// Fetch upcoming events for today and next few days
export const fetchUpcomingEvents = async (days: number = 7): Promise<Event[]> => {
  try {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + days);
    
    return mockEvents.filter(event => {
      return event.startTime >= now && event.startTime <= futureDate;
    }).sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    toast.error("Failed to fetch upcoming events. Please try again later.");
    return [];
  }
};

// In a production environment, you would implement actual API calls to the respective platforms
// For example:

// 1. For Codeforces:
// const fetchCodeforcesEvents = async (): Promise<Event[]> => {
//   const response = await fetch('https://codeforces.com/api/contest.list');
//   const data = await response.json();
//   
//   if (data.status === 'OK') {
//     return data.result
//       .filter(contest => contest.phase === 'BEFORE')
//       .map(contest => ({
//         id: `cf-${contest.id}`,
//         title: contest.name,
//         startTime: new Date(contest.startTimeSeconds * 1000),
//         endTime: new Date((contest.startTimeSeconds + contest.durationSeconds) * 1000),
//         url: `https://codeforces.com/contests/${contest.id}`,
//         platform: 'codeforces'
//       }));
//   }
//   return [];
// };

// 2. For LeetCode (would need a proxy server as they don't have a public API):
// const fetchLeetCodeEvents = async (): Promise<Event[]> => {
//   const response = await fetch('https://your-proxy-server.com/leetcode/contests');
//   const data = await response.json();
//   
//   return data.map(contest => ({
//     id: `lc-${contest.id}`,
//     title: contest.title,
//     startTime: new Date(contest.startTime),
//     endTime: new Date(contest.endTime),
//     url: `https://leetcode.com/contest/${contest.titleSlug}`,
//     platform: 'leetcode'
//   }));
// };

// Similar implementations would be needed for other platforms

