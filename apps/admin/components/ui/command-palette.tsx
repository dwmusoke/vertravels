"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Command,
  FileText,
  Users,
  Settings,
  LayoutDashboard,
  Building2,
  RefreshCcw,
  Clock,
  Ticket,
  Upload,
  FileCheck,
  CreditCard,
  Receipt,
  Wallet,
  BarChart3,
  Sliders,
  UserCheck,
  MessageSquare,
  TrendingUp,
  Activity,
  ScrollText,
  ArrowLeftRight,
  BookOpen,
  Plus,
  X,
} from "lucide-react";

interface CommandItem {
  id: string;
  label: string;
  href: string;
  icon: any;
  section: string;
  keywords: string[];
}

const pages: CommandItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/", icon: LayoutDashboard, section: "Core", keywords: ["home", "overview", "main"] },
  { id: "bookings", label: "Bookings", href: "/bookings", icon: FileText, section: "Core", keywords: ["reservations", "orders", "trips"] },
  { id: "pnr", label: "PNR Ingestion", href: "/pnr-ingestion", icon: Upload, section: "Core", keywords: ["import", "csv", "batch", "gds"] },
  { id: "manual", label: "Manual Postings", href: "/manual-postings", icon: FileText, section: "Core", keywords: ["manual", "entry", "pnr"] },
  { id: "queue", label: "Queue Management", href: "/queue", icon: Clock, section: "Core", keywords: ["queue", "gds", "tickets"] },
  { id: "ticketing", label: "Ticketing", href: "/ticketing", icon: Ticket, section: "Core", keywords: ["ticket", "issue", "eticket"] },
  { id: "automation", label: "Automation", href: "/automation", icon: RefreshCcw, section: "Core", keywords: ["rules", "workflow", "auto"] },
  { id: "vouchers", label: "Vouchers & Manifests", href: "/vouchers-manifests", icon: ScrollText, section: "Core", keywords: ["voucher", "manifest", "document"] },
  { id: "reconciliation", label: "Reconciliation", href: "/reconciliation", icon: ArrowLeftRight, section: "Core", keywords: ["bsp", "reconcile", "match"] },
  { id: "unused", label: "Unused Tickets", href: "/unused-tickets", icon: Ticket, section: "Core", keywords: ["unused", "void", "refund"] },
  { id: "invoices", label: "Invoices", href: "/documents/invoices", icon: Receipt, section: "Finance", keywords: ["invoice", "bill", "charge"] },
  { id: "payments", label: "Payments", href: "/documents/payments", icon: Wallet, section: "Finance", keywords: ["payment", "transaction", "received"] },
  { id: "quotations", label: "Quotations", href: "/documents/quotations", icon: FileCheck, section: "Finance", keywords: ["quote", "estimate", "proposal"] },
  { id: "statements", label: "Statements", href: "/documents/statements", icon: ScrollText, section: "Finance", keywords: ["statement", "aging", "balance"] },
  { id: "expenses", label: "Expenses", href: "/expenses", icon: CreditCard, section: "Finance", keywords: ["expense", "cost", "spend"] },
  { id: "sales", label: "Daily Sales Reports", href: "/documents/daily-sales", icon: BarChart3, section: "Finance", keywords: ["sales", "daily", "csv", "upload"] },
  { id: "fare", label: "Fare Optimization", href: "/fare-optimization", icon: TrendingUp, section: "Finance", keywords: ["fare", "price", "optimize", "compare"] },
  { id: "clients", label: "Clients (CRM)", href: "/crm", icon: Users, section: "CRM", keywords: ["client", "customer", "crm", "contact"] },
  { id: "inquiries", label: "Inquiries", href: "/contacts", icon: MessageSquare, section: "CRM", keywords: ["inquiry", "contact", "message", "form"] },
  { id: "suppliers", label: "Suppliers", href: "/suppliers", icon: Building2, section: "CRM", keywords: ["supplier", "vendor", "provider"] },
  { id: "partnerships", label: "Partnerships", href: "/partnerships", icon: Building2, section: "CRM", keywords: ["partner", "affiliate", "referral"] },
  { id: "agencies", label: "Agencies", href: "/agencies", icon: Building2, section: "CRM", keywords: ["agency", "branch", "tenant"] },
  { id: "insights", label: "Agency Insights", href: "/agency-insights", icon: Activity, section: "Analytics", keywords: ["analytics", "insight", "metrics"] },
  { id: "users", label: "Users", href: "/users", icon: UserCheck, section: "System", keywords: ["user", "staff", "employee", "account"] },
  { id: "modules", label: "Modules", href: "/modules", icon: Sliders, section: "System", keywords: ["module", "feature", "toggle"] },
  { id: "settings", label: "Settings", href: "/settings", icon: Settings, section: "System", keywords: ["setting", "config", "preference"] },
];

const actions = [
  { id: "new-booking", label: "New Booking", icon: Plus, shortcut: "B", href: "/bookings" },
  { id: "new-invoice", label: "New Invoice", icon: Plus, shortcut: "I", href: "/documents/invoices" },
  { id: "new-client", label: "New Client", icon: Plus, shortcut: "C", href: "/crm" },
];

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setSelectedIndex(0);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const filtered = query.trim()
    ? pages.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.label.toLowerCase().includes(q) ||
          p.section.toLowerCase().includes(q) ||
          p.keywords.some((k) => k.includes(q))
        );
      })
    : pages;

  const handleSelect = (item: CommandItem | typeof actions[0]) => {
    onClose();
    setQuery("");
    router.push(item.href);
  };

  if (!open) return null;

  const allResults = query.trim() ? filtered : [];
  const showAll = !query.trim();

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh]"
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-2xl bg-surface border border-border rounded-2xl shadow-modal animate-scale-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search pages, actions, or type ? for help..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex((i) => Math.min(i + 1, allResults.length + actions.length - 1));
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex((i) => Math.max(i - 1, 0));
              }
              if (e.key === "Enter") {
                e.preventDefault();
                const items = query.trim() ? allResults : actions;
                if (items[selectedIndex]) handleSelect(items[selectedIndex]);
              }
              if (e.key === "Escape") onClose();
            }}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
          />
          <button onClick={onClose} className="p-0.5 rounded text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto p-2">
          {query.trim() && allResults.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Search className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No results for &ldquo;{query}&rdquo;</p>
            </div>
          ) : showAll ? (
            /* Quick actions when no query */
            <div className="space-y-1">
              <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Quick Actions
              </p>
              {actions.map((action, i) => (
                <button
                  key={action.id}
                  onClick={() => handleSelect(action)}
                  onMouseEnter={() => setSelectedIndex(i)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors text-left ${
                    selectedIndex === i ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                  }`}
                >
                  <action.icon className="w-4 h-4 text-muted-foreground" />
                  <span className="flex-1">{action.label}</span>
                  <kbd className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
                    {action.shortcut}
                  </kbd>
                </button>
              ))}
              <p className="px-3 pt-3 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Browse Pages
              </p>
              <p className="px-3 text-xs text-muted-foreground">Type to search all pages...</p>
            </div>
          ) : (
            /* Search results */
            (() => {
              const grouped = allResults.reduce<Record<string, CommandItem[]>>((acc, item) => {
                if (!acc[item.section]) acc[item.section] = [];
                acc[item.section].push(item);
                return acc;
              }, {});

              let globalIndex = 0;
              return Object.entries(grouped).map(([section, items]) => (
                <div key={section} className="mb-2">
                  <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {section}
                  </p>
                  {items.map((item) => {
                    const currentIndex = globalIndex++;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setSelectedIndex(currentIndex)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors text-left ${
                          selectedIndex === currentIndex ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                        }`}
                      >
                        <item.icon className="w-4 h-4 text-muted-foreground" />
                        <span className="flex-1">{item.label}</span>
                        <span className="text-[10px] text-muted-foreground">{item.section}</span>
                      </button>
                    );
                  })}
                </div>
              ));
            })()
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 px-5 py-2.5 border-t border-border bg-muted/30">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <kbd className="px-1 py-0.5 bg-surface border border-border rounded text-[9px]">↑↓</kbd>
            <span>Navigate</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <kbd className="px-1 py-0.5 bg-surface border border-border rounded text-[9px]">↵</kbd>
            <span>Open</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <kbd className="px-1 py-0.5 bg-surface border border-border rounded text-[9px]">Esc</kbd>
            <span>Close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
