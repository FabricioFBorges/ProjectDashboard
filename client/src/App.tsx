import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import DayOfWeekPage from "@/pages/day-of-week";
import RegionalPage from "@/pages/regional";
import ProjectionPage from "@/pages/projection";
import ClientsPage from "@/pages/clients";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/day-of-week" component={DayOfWeekPage} />
      <Route path="/regional" component={RegionalPage} />
      <Route path="/projection" component={ProjectionPage} />
      <Route path="/clients" component={ClientsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
