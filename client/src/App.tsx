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
import { FacilityProvider } from "./lib/facility-context";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/assessment" component={Assessment} />
      <Route path="/compliance" component={Compliance} />
      <Route path="/financial" component={Financial} />
      <Route path="/deployment" component={Deployment} />
      <Route path="/resources" component={Resources} />
      <Route path="/map" component={MapView} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FacilityProvider>
        <Router />
        <Toaster />
      </FacilityProvider>
    </QueryClientProvider>
  );
}

export default App;
