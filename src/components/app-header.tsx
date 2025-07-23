
'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plane, LogOut, User, Settings, CreditCard } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { TravelModeDialog } from './travel-mode-dialog';
import { getUser } from '@/services/user-service';
import type { User as UserType } from '@/lib/data';
import { getTravelMode, disconnectTravelMode } from '@/services/travel-mode-service';

export function AppHeader() {
  const pathname = usePathname();
  const [isTravelMode, setIsTravelMode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);

  const fetchUser = () => {
    setUser(getUser());
  };

  useEffect(() => {
    fetchUser();
    const travelModeState = getTravelMode();
    setIsTravelMode(travelModeState.isActive);

    const handleTravelModeChange = () => {
      const updatedState = getTravelMode();
      setIsTravelMode(updatedState.isActive);
    };
    
    window.addEventListener('profileUpdated', fetchUser);
    window.addEventListener('travelModeChanged', handleTravelModeChange);

    return () => {
      window.removeEventListener('profileUpdated', fetchUser);
      window.removeEventListener('travelModeChanged', handleTravelModeChange);
    };
  }, []);

  const getPageTitle = () => {
    if (pathname === '/') return 'Dashboard';
    const name = pathname.split('/').pop() || '';
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const handleTravelModeChange = (checked: boolean) => {
    if (checked) {
      setIsDialogOpen(true);
    } else {
      disconnectTravelMode();
    }
  };

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
      <SidebarTrigger className="sm:hidden" />
      <h1 className="text-lg font-semibold md:text-xl">{getPageTitle()}</h1>
      <div className="ml-auto flex items-center gap-4">
        <div className="flex items-center space-x-2">
          <Switch 
            id="travel-mode" 
            checked={isTravelMode} 
            onCheckedChange={handleTravelModeChange}
          />
          <Label htmlFor="travel-mode" className="flex items-center gap-2">
            <Plane className="h-4 w-4" />
            <span className="hidden sm:inline">Travel Mode</span>
          </Label>
        </div>
      </div>
      <TravelModeDialog 
        isOpen={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
      />
    </header>
  );
}
