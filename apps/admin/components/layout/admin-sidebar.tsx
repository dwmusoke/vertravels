"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@vertravels/ui";
import {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  RefreshCcw,
  Building2,
  ChevronDown,
  ChevronRight,
  FileCheck,
  Upload,
  Clock,
  Ticket,
  Zap,
  CreditCard,
  Sliders,
  MessageSquare,
  Plane,
  Receipt,
  Repeat,
  PieChart,
  Bot,
  Workflow,
  Bell,
  BarChart3,
  UserCheck,
  Globe,
  Shield,
  PanelLeftClose,
  PanelLeft,
  Search,
  BookOpen,
  Wallet,
  ArrowLeftRight,
  Landmark,
  ScrollText,
  Briefcase,
  Mail,
  Sparkles,
  Activity,
  TrendingUp,
  GanttChartSquare,
  Network,
  CircleDot,
  ChevronLeft,
} from "lucide-react";

interface NavChild {
  name: string;
  href: string;
  icon: any;
}

interface NavSection {
  name: string;
  items: NavItem[];
}

interface NavItem {
  name: string;
  href: string;
  icon: any;
  badge?: string | number;
  children?: NavChild[];
}

const navigation: NavSection[] = [
  {
    name: "Core Operations",
    items: [
      { name: "Dashboard", href: "/", icon: LayoutDashboard },
      { name: "Bookings", href: "/bookings", icon: FileText, badge: "Live" },
      {
        name: "Reservations",
        href: "#",
        icon: BookOpen,
        children: [
          { name: "PNR Ingestion", href: "/pnr-ingestion", icon: Upload },
          { name: "Manual Postings", href: "/manual-postings", icon: FileText },
          { name: "Queue Management", href: "/queue", icon: Clock },
          { name: "Ticketing", href: "/ticketing", icon: Ticket },
        ],
      },
      {
        name: "Operations",
        href: "#",
        icon: RefreshCcw,
        children: [
          { name: "Automation", href: "/automation", icon: Zap },
          { name: "Vouchers & Manifests", href: "/vouchers-manifests", icon: ScrollText },
          { name: "Reconciliation", href: "/reconciliation", icon: ArrowLeftRight },
          { name: "Unused Tickets", href: "/unused-tickets", icon: Ticket },
        ],
      },
    ],
  },
  {
    name: "Financial Hub",
    items: [
      { name: "Invoices", href: "/documents/invoices", icon: Receipt },
      { name: "Payments", href: "/documents/payments", icon: Wallet },
      { name: "Quotations", href: "/documents/quotations", icon: FileCheck },
      { name: "Statements", href: "/documents/statements", icon: ScrollText },
      { name: "Expenses", href: "/expenses", icon: CreditCard },
      { name: "Daily Sales", href: "/documents/daily-sales", icon: BarChart3 },
      { name: "Fare Optimization", href: "/fare-optimization", icon: TrendingUp },
    ],
  },
  {
    name: "CRM & Sales",
    items: [
      { name: "Clients", href: "/crm", icon: Users },
      { name: "Inquiries", href: "/contacts", icon: MessageSquare },
      { name: "Suppliers", href: "/suppliers", icon: Building2 },
      { name: "Partnerships", href: "/partnerships", icon: Globe },
      { name: "Agencies", href: "/agencies", icon: Building2 },
    ],
  },
  {
    name: "Analytics",
    items: [
      { name: "Agency Insights", href: "/agency-insights", icon: Activity },
      { name: "Reports", href: "#", icon: PieChart },
    ],
  },
  {
    name: "System",
    items: [
      { name: "Users", href: "/users", icon: UserCheck },
      { name: "Modules", href: "/modules", icon: Sliders },
      { name: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [openFloating, setOpenFloating] = useState<string | null>(null);
  const floatingRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);

  const isCollapsed = collapsed && !hovered;
  const effectiveWidth = isCollapsed ? "var(--sidebar-collapsed-width)" : "var(--sidebar-width)";

  const toggleMenu = (name: string) => {
    setExpandedMenus((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  // Close floating menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (floatingRef.current && !floatingRef.current.contains(e.target as Node)) {
        setOpenFloating(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Auto-expand parent sections for active route
  useEffect(() => {
    navigation.forEach((section) => {
      section.items.forEach((item) => {
        if (item.children) {
          const activeChild = item.children.find(
            (c) => pathname === c.href || pathname.startsWith(c.href + "/")
          );
          if (activeChild && !expandedMenus.includes(item.name)) {
            setExpandedMenus((prev) => [...prev, item.name]);
          }
        }
      });
    });
  }, [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const isExactActive = (href: string) => pathname === href;

  const renderNavItem = (item: NavItem, inFloating = false) => {
    const active = item.href !== "#" && isActive(item.href);
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus.includes(item.name);

    if (hasChildren) {
      return (
        <div key={item.name}>
          <button
            onClick={() => {
              if (isCollapsed) {
                setOpenFloating(openFloating === item.name ? null : item.name);
              } else {
                toggleMenu(item.name);
              }
            }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 group",
              active
                ? "bg-sidebar-active/10 text-sidebar-active"
                : "text-sidebar-foreground/70 hover:bg-sidebar-hover hover:text-sidebar-foreground"
            )}
            title={isCollapsed ? item.name : undefined}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!isCollapsed && (
              <>
                <span className="flex-1 text-left truncate">{item.name}</span>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 opacity-50" />
                ) : (
                  <ChevronRight className="w-4 h-4 opacity-50" />
                )}
              </>
            )}
          </button>
          {!isCollapsed && isExpanded && (
            <div className="ml-9 mt-0.5 space-y-0.5">
              {item.children!.map((child) => {
                const childActive = isExactActive(child.href);
                return (
                  <Link
                    key={child.name}
                    href={child.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-150",
                      childActive
                        ? "bg-sidebar-active/10 text-sidebar-active font-medium"
                        : "text-sidebar-foreground/60 hover:bg-sidebar-hover hover:text-sidebar-foreground"
                    )}
                  >
                    <child.icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{child.name}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.name}
        href={item.href}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 group",
          active
            ? "bg-sidebar-active/10 text-sidebar-active"
            : "text-sidebar-foreground/70 hover:bg-sidebar-hover hover:text-sidebar-foreground"
        )}
        title={isCollapsed ? item.name : undefined}
      >
        <item.icon className="w-5 h-5 shrink-0" />
        {!isCollapsed && (
          <>
            <span className="flex-1 text-left truncate">{item.name}</span>
            {item.badge && (
              <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-emerald-500/10 text-emerald-400 uppercase tracking-wider">
                {item.badge}
              </span>
            )}
          </>
        )}
        {isCollapsed && item.badge && (
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500" />
        )}
      </Link>
    );
  };

  return (
    <>
      <aside
        ref={sidebarRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          setOpenFloating(null);
        }}
        className={cn(
          "fixed left-0 top-0 z-40 h-screen flex flex-col bg-sidebar transition-all duration-300 ease-in-out border-r border-sidebar-border",
          collapsed ? "w-[var(--sidebar-collapsed-width)]" : "w-[var(--sidebar-width)]"
        )}
        style={{ width: `var(${isCollapsed ? '--sidebar-collapsed-width' : '--sidebar-width'})` }}
      >
        {/* Logo area */}
        <div className={cn(
          "flex items-center h-16 shrink-0 border-b border-sidebar-border",
          isCollapsed ? "justify-center px-2" : "justify-between px-4"
        )}>
          {isCollapsed ? (
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">V</span>
            </div>
          ) : (
            <>
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-foreground">V</span>
                </div>
                <div>
                  <p className="font-bold text-sm text-sidebar-foreground">VerTravels</p>
                  <p className="text-[10px] text-sidebar-foreground/40">Travel Operations</p>
                </div>
              </Link>
              <button
                onClick={() => setCollapsed(true)}
                className="p-1.5 rounded-lg text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-hover transition-colors"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-3 space-y-5 scrollbar-none">
          {navigation.map((section) => (
            <div key={section.name}>
              {!isCollapsed && (
                <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/30">
                  {section.name}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => renderNavItem(item))}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className={cn(
          "shrink-0 border-t border-sidebar-border p-2",
          isCollapsed ? "flex flex-col items-center gap-1" : ""
        )}>
          <button
            className={cn(
              "flex items-center gap-3 rounded-lg transition-all duration-150 text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-hover",
              isCollapsed ? "p-2 justify-center w-full" : "px-3 py-2.5 w-full text-sm"
            )}
          >
            <Sparkles className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span className="truncate">AI Assistant</span>}
          </button>
          {isCollapsed ? (
            <button
              onClick={() => setCollapsed(false)}
              className="p-2 rounded-lg text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-hover transition-colors"
            >
              <PanelLeft className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setCollapsed(true)}
              className="hidden md:flex items-center gap-2 px-3 py-2 w-full text-sm rounded-lg text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-hover transition-colors"
            >
              <PanelLeftClose className="w-4 h-4" />
              <span>Collapse</span>
            </button>
          )}
        </div>
      </aside>

      {/* Floating submenu panel for collapsed mode */}
      {isCollapsed && openFloating && (() => {
        const parent = navigation.flatMap(s => s.items).find(i => i.name === openFloating);
        if (!parent?.children) return null;
        return (
          <div
            ref={floatingRef}
            className={cn(
              "fixed z-50 w-56 py-2 bg-sidebar border border-sidebar-border rounded-xl shadow-elevated animate-scale-in",
              "ml-[calc(var(--sidebar-collapsed-width)+4px)]"
            )}
            style={{ top: sidebarRef.current?.getBoundingClientRect().top ? `${sidebarRef.current.getBoundingClientRect().top + 80}px` : '80px' }}
          >
            <div className="px-4 py-1.5 border-b border-sidebar-border mb-1">
              <p className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">{openFloating}</p>
            </div>
            {parent.children.map((child) => {
              const childActive = isExactActive(child.href);
              return (
                <Link
                  key={child.name}
                  href={child.href}
                  onClick={() => setOpenFloating(null)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-150",
                    childActive
                      ? "bg-sidebar-active/10 text-sidebar-active font-medium"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-hover hover:text-sidebar-foreground"
                  )}
                >
                  <child.icon className="w-4 h-4 shrink-0" />
                  <span>{child.name}</span>
                </Link>
              );
            })}
          </div>
        );
      })()}
    </>
  );
}
