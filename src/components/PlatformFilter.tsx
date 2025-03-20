
import React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PlatformFilterProps {
  selectedPlatforms: string[];
  onPlatformChange: (platform: string) => void;
}

const PlatformFilter: React.FC<PlatformFilterProps> = ({
  selectedPlatforms,
  onPlatformChange,
}) => {
  const platforms = [
    { id: 'leetcode', name: 'LeetCode' },
    { id: 'codeforces', name: 'Codeforces' },
    { id: 'codechef', name: 'CodeChef' },
    { id: 'atcoder', name: 'AtCoder' },
    { id: 'hackerrank', name: 'HackerRank' },
    { id: 'gfg', name: 'GeeksforGeeks' },
  ];

  const allSelected = selectedPlatforms.length === platforms.length;
  const displayText = allSelected ? 'All Platforms Selected' : `${selectedPlatforms.length} Platforms Selected`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {displayText}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Platforms</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {platforms.map((platform) => (
          <DropdownMenuCheckboxItem
            key={platform.id}
            checked={selectedPlatforms.includes(platform.id)}
            onCheckedChange={() => onPlatformChange(platform.id)}
          >
            {platform.name}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PlatformFilter;
