import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { 
  Building2, 
  Map, 
  List, 
  BarChart3, 
  Package2, 
  Settings, 
  Search, 
  Bell, 
  Menu, 
  X,
  LogOut,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { isAdmin, user, logoutMutation } = useAuth();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  if (!isAdmin) {
    return <Redirect to="/unauthorized" />;
  }

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: Building2 },
    { name: "Facilities Map", href: "/admin/facilities-map", icon: Map },
    { name: "Facility List", href: "/map", icon: List }, // Using existing map view as fallback
    { name: "Analytics & Reports", href: "/admin/dashboard", icon: BarChart3 }, // Fallback to dashboard
    { name: "Resource Management", href: "/admin/dashboard", icon: Package2 }, // Fallback to dashboard
    { name: "Settings", href: "/admin/dashboard", icon: Settings }, // Fallback to dashboard
  ];

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar toggle */}
      <button
        className="fixed z-50 bottom-4 right-4 p-3 rounded-full bg-primary text-white lg:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center h-16 px-4 border-b">
          <Link href="/admin/dashboard" className="flex items-center">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              EverGrid
            </span>
            <span className="ml-2 text-sm font-medium text-muted-foreground">Admin Portal</span>
          </Link>
        </div>

        <div className="py-4 flex flex-col h-[calc(100%-4rem)] justify-between">
          <nav className="space-y-1 px-2">
            {navItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm rounded-md group transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5 transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="px-4 py-2 mt-6">
            <div className="rounded-md bg-primary/10 p-3">
              <div className="flex items-center">
                <div className="mr-3 flex-shrink-0 p-1 bg-primary/20 rounded-md">
                  <Badge className="px-1.5 py-0.5 bg-green-500">Live</Badge>
                </div>
                <div>
                  <h4 className="text-sm font-medium">System Status</h4>
                  <p className="text-xs text-muted-foreground">Data updated 2 minutes ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={cn(
        "flex-1 flex flex-col min-h-screen transition-all duration-200 ease-in-out",
        sidebarOpen ? "lg:ml-64" : ""
      )}>
        {/* Header */}
        <header className="bg-background z-30 border-b h-16 flex items-center justify-between px-4 lg:px-6">
          <div className="flex-1 flex items-center space-x-4">
            <div className="lg:w-64 w-full max-w-md">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by facility name, address, ID..."
                  className="w-full bg-muted/30 border-none rounded-md pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-primary"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-y-auto p-2">
                  <div className="flex items-start gap-3 py-2">
                    <div className="rounded-full bg-primary/20 p-1">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">New facility registered</p>
                      <p className="text-xs text-muted-foreground">Sunset Hills SNF in Los Angeles just completed registration</p>
                      <p className="text-xs text-muted-foreground">10 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 py-2">
                    <div className="rounded-full bg-amber-500/20 p-1">
                      <Map className="h-4 w-4 text-amber-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Assessment completed</p>
                      <p className="text-xs text-muted-foreground">Lakeside Care Center finished their assessment</p>
                      <p className="text-xs text-muted-foreground">1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 py-2">
                    <div className="rounded-full bg-red-500/20 p-1">
                      <Map className="h-4 w-4 text-red-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">High-risk facility alert</p>
                      <p className="text-xs text-muted-foreground">Pinecrest Health is in a new PSPS zone</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-muted/30">{children}</main>
      </div>
    </div>
  );
}