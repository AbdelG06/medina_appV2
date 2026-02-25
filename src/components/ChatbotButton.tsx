import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

const ChatbotButton = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "bot" | "user"; text: string }[]>([
    { role: "bot", text: "Marhba bikoum ! 👋 Je suis votre guide virtuel de la médina de Fès. Comment puis-je vous aider ?" },
  ]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");

  const quickReplies = [
    "Meilleur trajet vers Al Quaraouiyine ?",
    "Où acheter des babouches ?",
    "Horaires du Musée Nejjarine ?",
  ];

  const handleSend = (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", text: msg },
      { role: "bot", text: "Merci pour votre question ! Cette fonctionnalité sera bientôt connectée à un assistant intelligent. En attendant, n'hésitez pas à explorer nos circuits et notre guide patrimoine. 🏛" },
    ]);
    setInput("");
  };

  return (
    <>
      {/* FAB */}
      {/* Always show the floating button when chat is closed, hide when open */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="w-14 h-14 rounded-full bg-moroccan-gradient text-primary-foreground shadow-moroccan flex items-center justify-center hover:opacity-90 transition-opacity"
          aria-label="Ouvrir le chatbot"
          style={{ position: "fixed", bottom: 104, right: 24, zIndex: 101 }}
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat window */}
      {open && (
          <div
            className="w-80 sm:w-96 max-h-[500px] rounded-2xl bg-card border border-border shadow-2xl flex flex-col overflow-hidden"
            style={{ position: "fixed", bottom: 104, right: 24, zIndex: 101 }}
          >
            {/* Header with close X */}
            <div className="bg-moroccan-gradient p-4 text-primary-foreground flex items-center justify-between">
              <div>
                <h4 className="font-heading text-lg font-semibold">Guide Virtuel</h4>
                <p className="font-body text-xs opacity-80">Votre assistant pour découvrir la médina</p>
              </div>
              <button
                aria-label="Fermer le chatbot"
                onClick={() => setOpen(false)}
                className="ml-2 p-1 rounded hover:bg-red-100 text-white hover:text-red-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-72">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl px-3 py-2 text-sm font-body ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-xl px-3 py-2 text-sm font-body bg-muted text-foreground opacity-70 animate-pulse">
                    L'assistant réfléchit…
                  </div>
                </div>
              )}
            </div>

            {/* Quick replies */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {quickReplies.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    className="text-xs px-3 py-1.5 rounded-full border border-border bg-background text-foreground hover:bg-muted transition-colors font-body"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-border flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Posez votre question..."
                className="flex-1 bg-muted rounded-lg px-3 py-2 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button
                onClick={() => handleSend()}
                className="w-9 h-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
      )}
    </>
  );
};

export default ChatbotButton;
