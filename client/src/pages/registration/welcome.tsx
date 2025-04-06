import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, ArrowRight, Info } from "lucide-react";

export default function WelcomePage() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [, setLocation] = useLocation();

  const handleGetStarted = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setLocation("/registration/contact");
    }, 600);
  };

  // Skip to utility bill upload page for demo purposes
  const handleSkip = () => {
    // Auto-login as client and redirect to utility bill upload page
    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'client',
        password: 'password123',
      }),
    })
    .then(response => {
      if (response.ok) {
        setLocation("/utility-bill-upload");
      } else {
        setLocation("/auth"); // Fallback to auth if auto-login fails
      }
    })
    .catch(error => {
      console.error('Auto-login error:', error);
      setLocation("/auth"); // Fallback to auth if auto-login fails
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
      
      <Card className="w-full max-w-2xl shadow-lg border-0">
        <CardContent className="p-0">
          <div className="p-8 text-center">
            {/* Logo and animated element */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className={`absolute inset-0 bg-primary/10 rounded-full ${isAnimating ? 'animate-ping' : 'animate-pulse'}`}></div>
              <div className="relative flex items-center justify-center h-full">
                <Zap className={`h-14 w-14 text-primary transition-all duration-500 ${isAnimating ? 'scale-110' : 'animate-pulse'}`} />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-2">
              Power Solutions Made Simple
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-md mx-auto mb-8">
              Complete this quick assessment to discover your tailored microgrid solution for AB 2511 compliance
            </p>
            
            <Button 
              onClick={handleGetStarted}
              size="lg" 
              className={`w-full sm:w-auto px-8 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 ${isAnimating ? 'scale-105' : ''} transition-all duration-300`}
            >
              <span className="flex items-center">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            </Button>
            
            <div className="mt-4">
              <Link href="/learn-more" className="text-primary hover:underline inline-flex items-center text-sm">
                <Info className="h-3 w-3 mr-1" />
                Learn More About EverGrid
              </Link>
            </div>
          </div>
          
          {/* Visual element at bottom */}
          <div className="h-4 bg-gradient-to-r from-primary to-blue-600 rounded-b-lg"></div>
        </CardContent>
      </Card>
      
      <div className="mt-8 text-sm text-muted-foreground text-center">
        <p>© {new Date().getFullYear()} EverGrid - AB 2511 Compliance Platform</p>
      </div>
    </div>
  );
}