import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar, type PageId } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { LoginPage } from "@/pages/Login";
import { Dashboard } from "@/pages/Dashboard";
import { TransactionAnalysis } from "@/pages/TransactionAnalysis";
import { PredictionHistory } from "@/pages/PredictionHistory";
import { Analytics } from "@/pages/Analytics";
import { Reports } from "@/pages/Reports";
import { Settings } from "@/pages/Settings";

const AUTH_KEY = "fraudguard_auth";

function App() {
  const [authed, setAuthed] = useState<boolean>(
    () => sessionStorage.getItem(AUTH_KEY) === "true"
  );
  const [page, setPage] = useState<PageId>("dashboard");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    sessionStorage.setItem(AUTH_KEY, String(authed));
  }, [authed]);

  function handleLogin() {
    setAuthed(true);
    setPage("dashboard");
  }

  function handleLogout() {
    setAuthed(false);
  }

  function handleNavigate(p: PageId) {
    setPage(p);
  }

  if (!authed) {
    return (
      <>
        <TooltipProvider>
          <LoginPage onLogin={handleLogin} />
        </TooltipProvider>
        <Toaster />
      </>
    );
  }

  return (
    <>
      <TooltipProvider>
        <div className="flex h-screen overflow-hidden bg-background">
          <Sidebar
            activePage={page}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
          <MobileNav
            open={mobileNavOpen}
            onOpenChange={setMobileNavOpen}
            activePage={page}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
          <div className="flex flex-1 flex-col overflow-hidden">
            <Header
              activePage={page}
              onOpenMobileNav={() => setMobileNavOpen(true)}
            />
            <main className="flex-1 overflow-y-auto bg-grid p-4 md:p-6">
              <div className="mx-auto max-w-7xl animate-fade-in">
                {page === "dashboard" && <Dashboard />}
                {page === "analysis" && (
                  <TransactionAnalysis
                    onNavigateToHistory={() => setPage("history")}
                  />
                )}
                {page === "history" && (
                  <PredictionHistory
                    onNavigateToAnalysis={() => setPage("analysis")}
                  />
                )}
                {page === "analytics" && <Analytics />}
                {page === "reports" && <Reports />}
                {page === "settings" && <Settings onLogout={handleLogout} />}
              </div>
            </main>
          </div>
        </div>
      </TooltipProvider>
      <Toaster />
    </>
  );
}

export default App;
