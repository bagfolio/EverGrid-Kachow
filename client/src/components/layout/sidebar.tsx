import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useFacility } from "@/lib/facility-context";
import { useAuth } from "@/hooks/use-auth";

import { 
  LayoutDashboard, 
  ClipboardCheck, 
  ShieldCheck, 
  Calculator, 
  CalendarRange, 
  FileText, 
  MapPin,
  BatteryCharging,
  Users,
  LogOut,
  Zap
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();
  const { progress } = useFacility();
  const { isAdmin, logoutMutation } = useAuth();
  
  // Calculate overall progress percentage
  const progressStages = Object.values(progress);
  const completedStages = progressStages.filter(Boolean).length;
  const overallProgress = Math.round((completedStages / progressStages.length) * 100);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Client navigation items
  const clientNavItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, current: location === '/dashboard' },
    { name: 'Assessment', href: '/assessment', icon: BatteryCharging, current: location === '/assessment' },
    { name: 'Compliance', href: '/compliance', icon: ShieldCheck, current: location === '/compliance' },
    { name: 'Financial', href: '/financial', icon: Calculator, current: location === '/financial' },
    { name: 'Deployment', href: '/deployment', icon: CalendarRange, current: location === '/deployment' },
    { name: 'Resources', href: '/resources', icon: FileText, current: location === '/resources' },
  ];
  
  // Admin navigation items - redirect admins to the full-featured admin dashboard
  const adminNavItems = [
    { name: 'Admin Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, current: location === '/admin' || location === '/admin/dashboard' }
  ];
  
  // Select the appropriate navigation items based on user role
  const navigationItems = isAdmin ? adminNavItems : clientNavItems;

  return (
    <div className={cn("flex flex-col w-64 border-r border-gray-200 bg-white", className)}>
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-gray-200 bg-white">
        <Link href={isAdmin ? "/admin/dashboard" : "/dashboard"} className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <span className="ml-2 text-xl font-semibold text-gray-800">EverGrid</span>
        </Link>
        
        <Link href="/role-select" className="ml-4 text-sm text-gray-600 hover:text-primary transition-colors">
          Switch Portal
        </Link>
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
        
        {/* Logout button */}
        <div className="px-4 mt-6 mb-2">
          <button
            onClick={handleLogout}
            className={cn(
              "flex w-full items-center px-2 py-2 text-sm font-medium rounded-md",
              "text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors"
            )}
          >
            <LogOut className="mr-3 flex-shrink-0 h-5 w-5 text-gray-500" />
            Logout
          </button>
          
          {/* Switch role button */}
          <Link
            href="/role-select"
            className={cn(
              "flex w-full items-center px-2 py-2 mt-2 text-sm font-medium rounded-md",
              "text-gray-700 hover:bg-gray-100 transition-colors"
            )}
          >
            <Users className="mr-3 flex-shrink-0 h-5 w-5 text-gray-500" />
            Switch Role
          </Link>
        </div>
      </nav>
    </div>
  );
}
