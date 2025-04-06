import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { HomePage } from "@/components/landing/home-page";
import { Loader2 } from "lucide-react";

export default function LandingPage() {
  const { user, isLoading } = useAuth();
  
  // If user is already logged in, redirect them to their dashboard
  if (user && !isLoading) {
    // Redirect admin to admin dashboard, regular users to client dashboard
    if (user.role === "admin") {
      return <Redirect to="/admin/dashboard" />;
    } else {
      return <Redirect to="/dashboard" />;
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  // For non-authenticated users, redirect to the role select page
  // to maintain the original flow
  return <Redirect to="/role-select" />;
}