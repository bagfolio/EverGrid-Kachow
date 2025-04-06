import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useFacility } from "@/lib/facility-context";

import { 
  HomeIcon, 
  ClipboardIcon, 
  ShieldCheckIcon, 
  Banknote, 
  CalendarIcon, 
  BookOpenIcon, 
  MapPinIcon
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();
  const { progress } = useFacility();
  
  // Calculate overall progress percentage
  const progressStages = Object.values(progress);
  const completedStages = progressStages.filter(Boolean).length;
  const overallProgress = Math.round((completedStages / progressStages.length) * 100);

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, current: location === '/' || location === '/dashboard' },
    { name: 'Assessment', href: '/assessment', icon: ClipboardIcon, current: location === '/assessment' },
    { name: 'Compliance', href: '/compliance', icon: ShieldCheckIcon, current: location === '/compliance' },
    { name: 'Financial', href: '/financial', icon: Banknote, current: location === '/financial' },
    { name: 'Deployment', href: '/deployment', icon: CalendarIcon, current: location === '/deployment' },
    { name: 'Resources', href: '/resources', icon: BookOpenIcon, current: location === '/resources' },
    { name: 'Map View', href: '/map', icon: MapPinIcon, current: location === '/map' },
  ];

  return (
    <div className={cn("flex flex-col w-64 border-r border-gray-200 bg-white", className)}>
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-gray-200 bg-white">
        <div className="flex items-center">
          <svg className="h-8 w-8 text-primary-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 8L12 4L18 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="ml-2 text-xl font-semibold text-gray-800 font-display">EverGrid</span>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 pt-3 pb-4 overflow-y-auto">
        <div className="px-2 space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-2 py-2 text-sm font-medium rounded-md",
                item.current 
                  ? "bg-primary-50 text-primary-700" 
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <item.icon 
                className={cn(
                  "mr-3 flex-shrink-0 h-6 w-6", 
                  item.current ? "text-primary-700" : "text-gray-500"
                )} 
              />
              {item.name}
            </Link>
          ))}
        </div>

        <div className="mt-8">
          <div className="px-4">
            <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Compliance Status
            </h3>
            <div className="mt-2 px-2">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block text-primary-700">
                      Overall Progress
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-primary-700">
                      {overallProgress}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                  <div 
                    style={{ width: `${overallProgress}%` }} 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
