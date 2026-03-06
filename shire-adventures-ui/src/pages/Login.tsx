import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, LogIn } from "lucide-react";

interface LoginProps {
  onLogin: (user: any, token: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("https://the-shadow-backend.vercel.app/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin(data.user, data.token);
    } catch (error) {
      setError("Could not connect to the server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Sparkles className="w-6 h-6 text-gold animate-flicker" />
            <h1 className="font-display text-4xl gold-text">Tales of Middle-earth</h1>
            <Sparkles className="w-6 h-6 text-gold animate-flicker" />
          </div>
          <p className="text-muted-foreground font-body italic">
            A Chronicle of the Fellowship's Journey
          </p>
        </div>

        {/* Login Form */}
        <div className="border border-gold/30 rounded-lg p-8 bg-muted/5 shadow-2xl">
          <h2 className="font-display text-xl text-gold mb-6 text-center">
            — Who enters the Shire? —
          </h2>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="text-gold/60 text-xs uppercase tracking-widest mb-1 block font-display">
                Name
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. Colton"
                required
                className="w-full p-3 bg-background border border-gold/20 text-gold rounded outline-none focus:border-gold/50 font-body"
              />
            </div>

            <div>
              <label className="text-gold/60 text-xs uppercase tracking-widest mb-1 block font-display">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full p-3 bg-background border border-gold/20 text-gold rounded outline-none focus:border-gold/50 font-body"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center font-body">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 bg-gold text-background font-bold py-3 rounded hover:bg-gold/80 transition-colors disabled:opacity-50 font-display mt-2"
            >
              <LogIn className="w-4 h-4" />
              {isLoading ? "Entering the Shire..." : "Enter"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}