import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Assessment from "@/pages/assessment";
import Compliance from "@/pages/compliance";
import Financial from "@/pages/financial";
import Deployment from "@/pages/deployment";
import Resources from "@/pages/resources";
import MapView from "@/pages/map";
import AuthPage from "@/pages/auth-page";
import Unauthorized from "@/pages/unauthorized";
import AdminDashboard from "@/pages/admin/dashboard";
import { FacilityProvider } from "./lib/facility-context";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

function Router() {
  return (
    <Switch>
      {/* Public route */}
      <Route path="/auth" component={AuthPage} />
      <Route path="/unauthorized" component={Unauthorized} />
      
      {/* Protected client routes */}
      <ProtectedRoute path="/" component={Dashboard} />
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <ProtectedRoute path="/assessment" component={Assessment} />
      <ProtectedRoute path="/compliance" component={Compliance} />
      <ProtectedRoute path="/financial" component={Financial} />
      <ProtectedRoute path="/deployment" component={Deployment} />
      <ProtectedRoute path="/resources" component={Resources} />
      <ProtectedRoute path="/map" component={MapView} />
      
      {/* Protected admin routes */}
      <ProtectedRoute path="/admin" component={AdminDashboard} adminOnly />
      <ProtectedRoute path="/admin/dashboard" component={AdminDashboard} adminOnly />
      
      {/* Fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <FacilityProvider>
          <Router />
          <Toaster />
        </FacilityProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
