import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import Header from "@/components/header";
import Home from "@/pages/home";
import Collections from "@/pages/collections";
import CreateCollectionModal from "@/components/create-collection-modal";
import NotFound from "@/pages/not-found";

function Router() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCreateCollection = () => {
    setIsCreateModalOpen(true);
  };

  return (
    <>
      <Header onSearch={handleSearch} onCreateCollection={handleCreateCollection} />
      <Switch>
        <Route path="/" component={() => <Home searchQuery={searchQuery} />} />
        <Route path="/collections" component={Collections} />
        <Route component={NotFound} />
      </Switch>
      
      <CreateCollectionModal
        photo={null}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="pingallery-theme">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
