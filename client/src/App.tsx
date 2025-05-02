import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { UIProvider } from "@/contexts/UIContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext"; 
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { SearchModal } from "@/components/search/SearchModal";
import { MediaDetailsModal } from "@/components/details/MediaDetailsModal";

import Home from "@/pages/Home";
import Movies from "@/pages/Movies";
import TVShows from "@/pages/TVShows";
import Favorites from "@/pages/Favorites";
import SearchResults from "@/pages/SearchResults";
import MediaDetails from "@/pages/MediaDetails";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/trending" component={Movies} />
      <Route path="/movies" component={Movies} />
      <Route path="/tv-shows" component={TVShows} />
      <Route path="/favorites" component={Favorites} />
      <Route path="/search" component={SearchResults} />
      <Route path="/movie/:id" component={MediaDetails} />
      <Route path="/tv/:id" component={MediaDetails} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FavoritesProvider>
        <UIProvider>
          <Navbar />
          <Router />
          <Footer />
          <MobileMenu />
          <SearchModal />
          <MediaDetailsModal />
          <Toaster />
        </UIProvider>
      </FavoritesProvider>
    </QueryClientProvider>
  );
}

export default App;
