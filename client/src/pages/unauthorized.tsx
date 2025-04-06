import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { ShieldAlert, LogOut, Home } from "lucide-react";
import { Link } from "wouter";

export default function Unauthorized() {
  const { logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="rounded-full bg-destructive/10 p-4 w-20 h-20 mx-auto flex items-center justify-center">
          <ShieldAlert className="h-10 w-10 text-destructive" />
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Access Denied</h1>
        
        <p className="text-muted-foreground">
          You don't have permission to access this page. This area is restricted to administrators only.
        </p>
        
        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Return to Dashboard
            </Link>
          </Button>
          
          <Button variant="destructive" onClick={handleLogout} disabled={logoutMutation.isPending}>
            {logoutMutation.isPending ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin">●</span>
                Logging out...
              </>
            ) : (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}