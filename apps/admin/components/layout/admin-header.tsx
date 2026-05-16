"use client";

import { useEffect, useState, useRef } from "react";
import {
  Search,
  Bell,
  LogOut,
  Moon,
  Sun,
  Sparkles,
  ChevronDown,
  Command,
  Plus,
  Bot,
} from "lucide-react";
import { Button, Avatar, AvatarFallback, AvatarImage } from "@vertravels/ui";
import { useSupabase } from "@/components/providers/supabase-provider";
import { useTheme } from "@/components/providers/theme-provider";
import type { User } from "@supabase/supabase-js";

export function AdminHeader() {
  const { supabase } = useSupabase();
  const { theme, toggle: toggleTheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, [supabase]);

  // Global search keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setQuery("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-surface/80 backdrop-blur-xl border-b border-border/60">
        <div className="flex h-14 items-center gap-3 px-4 lg:px-6">
          {/* Global search */}
          <div className="flex-1 max-w-md">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full flex items-center gap-2 px-3 py-2 bg-muted/50 border border-border/60 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:border-border transition-all duration-150 group"
            >
              <Search className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left">Search anything...</span>
              <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium bg-surface border border-border rounded">
                <Command className="w-2.5 h-2.5" />K
              </kbd>
            </button>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            {/* AI Assistant */}
            <button className="btn-icon relative group">
              <Bot className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-ai" />
              <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-2 py-1 bg-foreground text-background text-[10px] font-medium rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
                AI Assistant
              </span>
            </button>

            {/* Quick create */}
            <button className="btn-icon group">
              <Plus className="w-5 h-5" />
              <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-2 py-1 bg-foreground text-background text-[10px] font-medium rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
                Quick Create
              </span>
            </button>

            {/* Currency/Branch selector */}
            <div className="hidden md:flex items-center gap-1 px-2 py-1.5 mx-1 rounded-lg text-xs font-medium text-muted-foreground hover:bg-muted cursor-pointer transition-colors">
              <span>USD</span>
              <ChevronDown className="w-3 h-3" />
            </div>

            {/* Theme toggle */}
            <button onClick={toggleTheme} className="btn-icon group">
              {theme === "light" ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
              <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-2 py-1 bg-foreground text-background text-[10px] font-medium rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
                {theme === "light" ? "Dark mode" : "Light mode"}
              </span>
            </button>

            {/* Notifications */}
            <button className="btn-icon relative group">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-danger" />
              <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-2 py-1 bg-foreground text-background text-[10px] font-medium rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
                Notifications
              </span>
            </button>

            {/* User */}
            <div className="flex items-center gap-2 pl-2 ml-1 border-l border-border">
              <Avatar className="h-7 w-7">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden lg:block">
                <p className="text-xs font-medium text-foreground leading-tight">
                  {user?.email?.split("@")[0]}
                </p>
                <p className="text-[10px] text-muted-foreground">Admin</p>
              </div>
            </div>

            <button onClick={handleSignOut} className="btn-icon group">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Spotlight search modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
          onClick={() => { setSearchOpen(false); setQuery(""); }}
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-lg bg-surface border border-border rounded-xl shadow-modal animate-scale-in overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search className="w-5 h-5 text-muted-foreground shrink-0" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search pages, bookings, clients..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 outline-none"
              />
              <kbd className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
                ESC
              </kbd>
            </div>
            <div className="p-2 max-h-64 overflow-y-auto">
              {query ? (
                <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                  Search results will appear here
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Quick Actions
                  </p>
                  {[
                    { icon: Plus, label: "New Booking", shortcut: "B" },
                    { icon: Plus, label: "New Invoice", shortcut: "I" },
                    { icon: Plus, label: "New Client", shortcut: "C" },
                  ].map((action) => (
                    <button
                      key={action.label}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-muted transition-colors text-left"
                    >
                      <action.icon className="w-4 h-4 text-muted-foreground" />
                      <span className="flex-1">{action.label}</span>
                      <kbd className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
                        {action.shortcut}
                      </kbd>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
