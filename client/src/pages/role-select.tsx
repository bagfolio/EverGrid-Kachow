import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Shield,
  Users,
  Building,
  BatteryCharging,
  Clock,
  FileText,
  ChevronRight,
  Zap
} from "lucide-react";

export default function RoleSelect() {
  const { loginMutation, user } = useAuth();
  const [isLoading, setIsLoading] = useState<{ client: boolean; admin: boolean }>({
    client: false,
    admin: false
  });

  const handleClientLogin = async () => {
    setIsLoading({ client: true, admin: false });
    loginMutation.mutate({ 
      username: "client", 
      password: "password123" 
    });
  };

  const handleAdminLogin = async () => {
    setIsLoading({ client: false, admin: true });
    loginMutation.mutate({ 
      username: "admin", 
      password: "admin123" 
    });
  };

  // If user is already logged in, redirect to home
  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-2">
          <Zap className="h-12 w-12 text-primary mr-2" />
          <h1 className="text-4xl font-bold">EverGrid</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Your complete platform for AB 2511 compliance and backup power solutions.
        </p>
        <div className="mt-2 bg-amber-100 text-amber-800 py-1 px-4 rounded-full inline-flex items-center text-sm">
          <Clock className="h-4 w-4 mr-1" />
          <span>Compliance deadline: January 1, 2026</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl w-full">
        <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full" />
          
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Facility Portal</CardTitle>
            </div>
            <CardDescription>
              For skilled nursing facility staff and management
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium">Compliance Dashboard</h3>
                  <p className="text-sm text-muted-foreground">
                    Track your facility's AB 2511 compliance status
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <BatteryCharging className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium">Energy Assessment</h3>
                  <p className="text-sm text-muted-foreground">
                    Evaluate your facility's power needs
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium">Financial Planning</h3>
                  <p className="text-sm text-muted-foreground">
                    ROI calculators and cost comparisons
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              className="w-full group" 
              onClick={handleClientLogin}
              disabled={isLoading.client || isLoading.admin}
            >
              {isLoading.client ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                <span className="flex items-center">
                  Enter as Facility Staff
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full" />
          
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Admin Portal</CardTitle>
            </div>
            <CardDescription>
              For EverGrid administrators and consultants
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium">User Management</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage facility users and access control
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <Building className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium">Facility Overview</h3>
                  <p className="text-sm text-muted-foreground">
                    Monitor compliance across all facilities
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium">Analytics Dashboard</h3>
                  <p className="text-sm text-muted-foreground">
                    View compliance statistics and progress reports
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              className="w-full group" 
              variant="outline"
              onClick={handleAdminLogin}
              disabled={isLoading.client || isLoading.admin}
            >
              {isLoading.admin ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                <span className="flex items-center">
                  Enter as Administrator
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="mt-8 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} EverGrid - AB 2511 Compliance Platform</p>
      </div>
    </div>
  );
}