import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Send, Sparkles, MessageSquare, Search } from "lucide-react";
import { chatThreads, suggestedPrompts, type ChatMessage } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/chat")({
  head: () => ({
    meta: [
      { title: "AI Assistant — UXray" },
      { name: "description", content: "Ask UXray anything about your UX." },
    ],
  }),
  component: Chat,
});

const seed: ChatMessage[] = [
  {
    id: "m1",
    role: "assistant",
    content:
      "Hi Sarah — I've reviewed your latest audits. Ask me about issues, trends, or how to ship fixes.",
    time: "now",
  },
];

function Chat() {
  const [active, setActive] = useState(chatThreads[0]!.id);
  const [messages, setMessages] = useState<ChatMessage[]>(seed);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function send(text?: string) {
    const content = text ?? input.trim();
    if (!content) return;
    const user: ChatMessage = { id: crypto.randomUUID(), role: "user", content, time: "now" };
    setMessages((m) => [...m, user]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [
        ...m,
        { id: crypto.randomUUID(), role: "assistant", time: "now", content: mockAnswer(content) },
      ]);
    }, 1200);
  }

  return (
    <div className="h-full flex">
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-sidebar/50">
        <div className="p-3">
          <Button
            className="w-full justify-start gap-2 bg-gradient-primary text-primary-foreground border-0"
            onClick={() => {
              setActive("new");
              setMessages(seed);
            }}
          >
            <Plus className="h-4 w-4" /> New chat
          </Button>
        </div>
        <div className="px-3">
          <div className="relative">
            <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search…"
              className="w-full bg-background border border-border rounded-md pl-8 pr-2 py-1.5 text-xs"
            />
          </div>
        </div>
        <ScrollArea className="flex-1 p-2">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground px-2 py-2">
            Recent
          </div>
          {chatThreads.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-md text-sm hover:bg-accent transition flex items-start gap-2",
                active === t.id && "bg-accent",
              )}
            >
              <MessageSquare className="h-3.5 w-3.5 mt-0.5 text-muted-foreground shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="truncate">{t.title}</div>
                <div className="text-[10px] text-muted-foreground">{t.updated}</div>
              </div>
            </button>
          ))}
        </ScrollArea>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto p-6 space-y-6">
            {messages.length === 1 && (
              <div className="text-center py-8">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-aurora grid place-items-center shadow-glow">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h2 className="mt-4 text-2xl font-semibold">How can I help today?</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  I can analyze audits, suggest fixes, and benchmark your scores.
                </p>
                <div className="mt-6 grid sm:grid-cols-2 gap-2 max-w-xl mx-auto">
                  {suggestedPrompts.map((p) => (
                    <Card
                      key={p}
                      role="button"
                      onClick={() => send(p)}
                      className="p-3 text-left text-sm bg-card/60 hover:border-primary/50 cursor-pointer transition"
                    >
                      {p}
                    </Card>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m) => (
              <Bubble key={m.id} msg={m} />
            ))}
            {typing && (
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-aurora grid place-items-center shrink-0">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div className="flex items-center gap-1 mt-2">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      className="h-2 w-2 rounded-full bg-muted-foreground"
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        </div>

        <div className="border-t border-border bg-background/60 backdrop-blur-xl p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="max-w-3xl mx-auto"
          >
            <div className="relative glass rounded-2xl border-border shadow-elegant">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about your audits…"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                className="w-full bg-transparent resize-none px-4 py-3 pr-14 text-sm outline-none min-h-[56px] max-h-40"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim()}
                className="absolute right-2 bottom-2 h-9 w-9 bg-gradient-primary text-primary-foreground border-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-[10px] text-muted-foreground text-center mt-2">
              Demo responses are mocked. No backend in this preview.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Bubble({ msg }: { msg: ChatMessage }) {
  if (msg.role === "user")
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-tr-md bg-gradient-primary text-primary-foreground px-4 py-2.5 text-sm shadow-glow">
          {msg.content}
        </div>
      </div>
    );
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-3"
      >
        <div className="h-8 w-8 rounded-full bg-gradient-aurora grid place-items-center shrink-0">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1 text-sm leading-relaxed pt-1 whitespace-pre-wrap">{msg.content}</div>
      </motion.div>
    </AnimatePresence>
  );
}

function mockAnswer(q: string) {
  const lower = q.toLowerCase();
  if (lower.includes("critical"))
    return "Your top 3 critical issues this week are:\n\n1. Insufficient color contrast on the checkout CTA (3.2:1 vs 4.5:1 required)\n2. Form inputs missing accessible labels on 5 fields\n3. Navigation lacks visible focus indicator\n\nFixing all three would lift your overall score from 78 → 91. Want me to generate a PR?";
  if (lower.includes("screen reader"))
    return "For screen reader users, your site scores 51/100 — well below your overall 87. The biggest gaps:\n• 12 images with missing or generic alt text\n• 5 form fields without labels\n• Heading hierarchy skips from h1 to h4 on the product page\n\nA persona-targeted audit would surface ~17 issues specific to assistive tech.";
  if (lower.includes("benchmark") || lower.includes("compare"))
    return "Compared to industry benchmarks for SaaS dashboards:\n• Your overall score (87) is in the top 25%\n• WCAG (92) — top 10%\n• Heuristics (81) — average\n• DOM (89) — top 20%\n\nThe heuristic gap is mostly around error recovery messaging.";
  return "Here's what I found: your most recent audit on acme.com/checkout has 4 critical and 11 medium issues. The highest-impact fix is the primary CTA contrast — a 5-minute change worth +8 to your overall score. Want a deeper breakdown?";
}
