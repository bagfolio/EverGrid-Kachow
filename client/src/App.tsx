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
import RoleSelect from "@/pages/role-select";
import Unauthorized from "@/pages/unauthorized";
import AdminDashboard from "@/pages/admin/dashboard";
import WelcomePage from "@/pages/registration/welcome";
import ContactPage from "@/pages/registration/contact";
import FacilityTypePage from "@/pages/registration/facility-type";
import FacilityInfoPage from "@/pages/registration/facility-info";
import UtilityBillUpload from "@/pages/utility-bill-upload";
import { FacilityProvider } from "./lib/facility-context";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={RoleSelect} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/unauthorized" component={Unauthorized} />
      
      {/* Registration flow */}
      <Route path="/registration/welcome" component={WelcomePage} />
      <Route path="/registration/contact" component={ContactPage} />
      <Route path="/registration/facility-type" component={FacilityTypePage} />
      <Route path="/registration/facility-info" component={FacilityInfoPage} />
      <Route path="/utility-bill-upload" component={UtilityBillUpload} />
      
      {/* Protected client routes */}
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <ProtectedRoute path="/assessment" component={Assessment} />
      <ProtectedRoute path="/compliance" component={Compliance} />
      <ProtectedRoute path="/financial" component={Financial} />
      <ProtectedRoute path="/deployment" component={Deployment} />
      <ProtectedRoute path="/resources" component={Resources} />
      
      {/* Protected admin routes */}
      <ProtectedRoute path="/admin" component={AdminDashboard} adminOnly />
      <ProtectedRoute path="/admin/dashboard" component={AdminDashboard} adminOnly />
      <ProtectedRoute path="/map" component={MapView} adminOnly />
      
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
