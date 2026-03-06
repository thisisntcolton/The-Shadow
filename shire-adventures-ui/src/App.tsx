import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setCurrentUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (user: any, token: string) => {
    setCurrentUser(user);
    setToken(token);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    setToken(null);
  };

  if (isLoading) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                currentUser ? (
                  <Index currentUser={currentUser} token={token} onLogout={handleLogout} />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />
            <Route
              path="/admin"
              element={
                currentUser?.role === 'DM' ? (
                  <Admin currentUser={currentUser} token={token!} onLogout={handleLogout} />
                ) : currentUser ? (
                  <Navigate to="/" />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;