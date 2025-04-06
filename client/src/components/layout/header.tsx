import React, { useState } from "react";
import { Bell, UserCircle, Menu, LogOut, Settings, ShieldAlert } from "lucide-react";
import { useFacility } from "@/lib/facility-context";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  toggleSidebar: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  const { selectedFacility, saveFacilityData } = useFacility();
  const { user, logoutMutation, isAdmin } = useAuth();
  const { toast } = useToast();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };
  
  const handleSave = () => {
    saveFacilityData();
    toast({
      title: "Progress saved",
      description: "Your progress has been saved and can be resumed later.",
      duration: 3000,
    });
  };
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200">
      <button 
        onClick={toggleSidebar}
        className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:bg-gray-100 focus:text-gray-700 md:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>
      
      <div className="flex-1 px-4 flex justify-between">
        <div className="flex-1 flex items-center">
          <div className="text-lg font-medium text-gray-700">
            {getGreeting()}, <span className="text-primary-600">{selectedFacility?.facility_name || 'Select a facility'}</span>
          </div>
        </div>
        
        <div className="ml-4 flex items-center md:ml-6">
          <Button
            variant="ghost"
            size="icon"
            className="relative text-gray-500 hover:bg-gray-100"
          >
            <Bell className="h-6 w-6" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
          </Button>
          
          <Button
            onClick={handleSave}
            className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400"
          >
            Save & Resume Later
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt={user?.name || user?.username || 'User'} />
                  <AvatarFallback>{
                    user?.name ? 
                      user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() 
                    : user?.username?.substring(0, 2).toUpperCase() || 'US'
                  }</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="font-medium">{user?.name || user?.username}</div>
                <div className="text-xs text-muted-foreground mt-1">{user?.email}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer">
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link to="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              
              {isAdmin && (
                <DropdownMenuItem asChild>
                  <Link to="/admin/dashboard" className="cursor-pointer">
                    <ShieldAlert className="mr-2 h-4 w-4" />
                    <span>Admin Dashboard</span>
                  </Link>
                </DropdownMenuItem>
              )}
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={handleLogout} disabled={logoutMutation.isPending} className="cursor-pointer text-destructive focus:text-destructive">
                {logoutMutation.isPending ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin">●</span>
                    <span>Logging out...</span>
                  </>
                ) : (
                  <>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
