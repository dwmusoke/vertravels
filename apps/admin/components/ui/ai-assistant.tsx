"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { Bot, X, Send, Sparkles, BarChart3, FileText, Users, DollarSign, TrendingUp, Loader2 } from "lucide-react";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
}

const suggestions = [
  { icon: BarChart3, label: "Revenue this month", query: "Show me revenue for this month" },
  { icon: FileText, label: "Pending bookings", query: "Show pending bookings" },
  { icon: Users, label: "Active clients", query: "How many active clients do I have?" },
  { icon: DollarSign, label: "Top invoices", query: "Show unpaid invoices" },
  { icon: TrendingUp, label: "Booking trends", query: "What are the booking trends?" },
];

const aiResponses: Record<string, string> = {
  "revenue": "Based on current data, your total revenue this period is **$124,500**. That's up 12.5% from last period. The average booking value is $2,450.",
  "pending": "You have **23 pending bookings** requiring attention:\n- 12 pending payment\n- 8 pending confirmation\n- 3 pending ticketing\n\nTotal value at risk: **$34,200**",
  "client": "You currently have **187 active clients** in your CRM. 45 are new this month (up 8%). Top clients by revenue:\n1. Acme Corp - $24,500\n2. Global Travel - $18,200\n3. Skyline Ltd - $12,800",
  "invoice": "You have **15 unpaid invoices** totaling **$42,800**:\n- 5 overdue (>30 days): $18,500\n- 4 due this week: $12,300\n- 6 future due: $12,000",
  "trend": "Booking trends for this period:\n- Total bookings: 89 (up 15%)\n- Average booking value: $2,450\n- Top route: JFK→LHR (22 bookings)\n- Peak booking day: Tuesday",
};

export function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm your AI operations assistant. Ask me about bookings, revenue, clients, or choose a suggestion below.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function getResponse(query: string): string {
    const q = query.toLowerCase();
    if (q.includes("revenue") || q.includes("earnings") || q.includes("income")) return aiResponses.revenue;
    if (q.includes("pending") || q.includes("unpaid") || q.includes("outstanding")) return aiResponses.pending;
    if (q.includes("client") || q.includes("customer") || q.includes("lead")) return aiResponses.client;
    if (q.includes("invoice") || q.includes("bill") || q.includes("payment")) return aiResponses.invoice;
    if (q.includes("trend") || q.includes("insight") || q.includes("analytics") || q.includes("chart")) return aiResponses.trend;
    return `I've analyzed your operations data. Here's a quick summary:\n\n- **${89 + Math.floor(Math.random() * 20)}** total bookings this period\n- **$${(120 + Math.floor(Math.random() * 50)).toLocaleString()}K** revenue\n- **${15 + Math.floor(Math.random() * 10)}%** growth rate\n- **${85 + Math.floor(Math.random() * 15)}%** booking conversion\n\nWhat specific area would you like me to analyze further?`;
  }

  async function handleSend(query?: string) {
    const text = (query || input).trim();
    if (!text || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Simulate AI processing
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));

    const responseText = getResponse(text);
    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: responseText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, assistantMsg]);
    setLoading(false);
  }

  function formatMessage(content: string): ReactNode {
    return content.split("\n").map((line, i) => {
      if (line.startsWith("- ")) {
        return <li key={i} className="text-xs text-foreground/80 ml-2">{line.slice(2)}</li>;
      }
      if (line.startsWith("**") && line.endsWith("**")) {
        return <p key={i} className="text-xs font-semibold text-foreground mt-1">{line.slice(2, -2)}</p>;
      }
      return <p key={i} className="text-xs text-foreground/80">{line}</p>;
    });
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-primary flex items-center justify-center shadow-elevated hover:shadow-glow transition-all duration-300 hover:scale-105 active:scale-95 ${
          open ? "opacity-0 scale-75 pointer-events-none" : ""
        }`}
      >
        <Bot className="w-5 h-5 text-white" />
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[400px] h-[560px] bg-surface border border-border rounded-2xl shadow-modal flex flex-col animate-scale-in overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-gradient-to-r from-violet-600 to-primary">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">AI Assistant</p>
                <p className="text-[10px] text-white/70">Ask me anything about your operations</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-white/10 transition-colors">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-transparent via-background/50 to-background">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : ""}`}>
                {msg.role === "assistant" && (
                  <div className="w-6 h-6 rounded-lg bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3 h-3 text-violet-600" />
                  </div>
                )}
                <div className={`max-w-[85%] ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground px-3 py-2 rounded-2xl rounded-tr-md"
                    : ""
                }`}>
                  {msg.role === "assistant" ? (
                    <div className="text-xs leading-relaxed space-y-0.5">
                      {formatMessage(msg.content)}
                    </div>
                  ) : (
                    <p className="text-xs">{msg.content}</p>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center">
                  <Bot className="w-3 h-3 text-violet-600" />
                </div>
                <div className="bg-muted px-3 py-2.5 rounded-2xl rounded-tl-md flex items-center gap-1.5">
                  <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Analyzing...</span>
                </div>
              </div>
            )}
            {messages.length === 1 && (
              <div className="pt-2">
                <p className="text-[10px] font-medium text-muted-foreground mb-2 uppercase tracking-wider">Suggestions</p>
                <div className="space-y-1">
                  {suggestions.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => handleSend(s.query)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                    >
                      <s.icon className="w-3.5 h-3.5 text-primary" />
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
                placeholder="Ask about your operations..."
                className="flex-1 input-field-sm"
                disabled={loading}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center disabled:opacity-40 hover:bg-primary/90 transition-colors shrink-0"
              >
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
