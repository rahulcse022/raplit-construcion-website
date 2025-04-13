import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import CustomBuilder from "@/pages/custom-builder";
import Packages from "@/pages/packages";
import Materials from "@/pages/materials";
import Portfolio from "@/pages/portfolio";
import Contact from "@/pages/contact";
import SavedPlans from "@/pages/saved-plans";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/common/BackToTop";
import { LanguageProvider } from "@/context/LanguageContext";
import { BuilderProvider } from "@/context/BuilderContext";
import { SavedPlansProvider } from "@/context/SavedPlansContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/custom-builder" component={CustomBuilder} />
      <Route path="/packages" component={Packages} />
      <Route path="/materials" component={Materials} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/contact" component={Contact} />
      <Route path="/saved-plans" component={SavedPlans} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <BuilderProvider>
          <SavedPlansProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                <Router />
              </main>
              <Footer />
              <BackToTop />
              <Toaster />
            </div>
          </SavedPlansProvider>
        </BuilderProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
