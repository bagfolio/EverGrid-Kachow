import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect, Link } from "wouter";
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
  Zap,
  CheckCircle2,
  Clock3,
  ArrowRight,
  ListChecks,
  HelpCircle
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Redirect to="/dashboard" />;
  }

  // Skip to utility bill upload page for demo purposes
  const handleSkip = () => {
    // Auto-login as client and redirect to utility bill upload page
    loginMutation.mutate({ 
      username: "client", 
      password: "password123" 
    }, {
      onSuccess: () => {
        window.location.href = "/utility-bill-upload";
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-background to-secondary/10 flex flex-col items-center justify-center p-4">
      {/* Skip button for demo purposes */}
      <Button 
        className="absolute top-4 right-4 bg-white/80 hover:bg-white/90 text-primary shadow-sm" 
        size="sm"
        onClick={handleSkip}
      >
        Skip to Bill Upload
      </Button>
      
      {/* Logo & Header Section with animated element */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-2 relative">
          <div className="absolute inset-0 bg-primary/5 rounded-full blur-xl animate-pulse"></div>
          <div className="relative animate-pulse">
            <Zap className="h-16 w-16 text-primary mr-2" />
          </div>
          <h1 className="relative text-5xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            EverGrid
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-md mx-auto mt-2">
          Your complete platform for AB 2511 compliance and backup power solutions.
        </p>
        <div className="mt-3 bg-amber-100 text-amber-800 py-1.5 px-5 rounded-full inline-flex items-center text-sm">
          <Clock className="h-4 w-4 mr-2" />
          <span>Compliance deadline: January 1, 2026</span>
        </div>
        <div className="mt-2 bg-primary/10 text-primary py-1.5 px-5 rounded-full inline-flex items-center text-sm">
          <CheckCircle2 className="h-4 w-4 mr-2" />
          <span>Already helping 350+ SNFs achieve compliance</span>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="max-w-4xl w-full mb-8">
        <h2 className="text-xl font-semibold text-center mb-6">How EverGrid Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <ListChecks className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium">1. Assess</h3>
            <p className="text-sm text-muted-foreground mt-1">Evaluate your facility's power needs and risks</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <BatteryCharging className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium">2. Plan</h3>
            <p className="text-sm text-muted-foreground mt-1">Design your custom microgrid solution</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium">3. Implement</h3>
            <p className="text-sm text-muted-foreground mt-1">Deploy and maintain your backup power system</p>
          </div>
        </div>
      </div>

      {/* Portal Selection Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
        <Card className="relative overflow-hidden border-2 hover:border-primary/70 transition-all bg-white shadow-md">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
          
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
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <FileText className="h-5 w-5 text-primary/70" />
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
                  <BatteryCharging className="h-5 w-5 text-primary/70" />
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
                  <FileText className="h-5 w-5 text-primary/70" />
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
          
          <CardFooter className="flex flex-col space-y-3">
            <Button 
              className="w-full group bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700" 
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
            <Link href="/registration/welcome" className="w-full">
              <Button 
                className="w-full group" 
                variant="outline"
              >
                <span className="flex items-center">
                  New Registration
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="relative overflow-hidden border-2 hover:border-primary/70 transition-all bg-white shadow-md">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
          
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
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <Users className="h-5 w-5 text-primary/70" />
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
                  <Building className="h-5 w-5 text-primary/70" />
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
                  <FileText className="h-5 w-5 text-primary/70" />
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
      
      {/* FAQ Section */}
      <div className="mt-10 w-full max-w-4xl">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="faq-1">
            <AccordionTrigger className="text-left">What is AB 2511 compliance?</AccordionTrigger>
            <AccordionContent>
              AB 2511 is California legislation requiring skilled nursing facilities to have backup power 
              systems capable of powering critical functions for at least 96 hours during emergencies by January 1, 2026.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-2">
            <AccordionTrigger className="text-left">How does EverGrid help with compliance?</AccordionTrigger>
            <AccordionContent>
              EverGrid provides a complete platform for assessing your facility's power needs, 
              planning appropriate backup systems, tracking compliance progress, and managing implementation.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-3">
            <AccordionTrigger className="text-left">What size facility can use EverGrid?</AccordionTrigger>
            <AccordionContent>
              EverGrid is designed to work with facilities of all sizes, from small 20-bed SNFs to large 
              200+ bed facilities. Our assessment tools scale to fit your specific facility's needs.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      
      <div className="mt-8 text-sm text-muted-foreground text-center">
        <p>© {new Date().getFullYear()} EverGrid - AB 2511 Compliance Platform</p>
        <div className="mt-2">
          <Link href="/learn-more" className="text-primary hover:underline inline-flex items-center">
            <HelpCircle className="h-3 w-3 mr-1" />
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}