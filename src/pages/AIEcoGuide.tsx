import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/layout/PageHeader';
import { aiGuideSuggestions, aiGuideResponses } from '@/data/mockData';
import { Bot, Send, Sparkles, User } from 'lucide-react';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

export function AIEcoGuide() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: "Hi there! I'm your AI Eco Guide 🌱 Ask me anything about the environment, sustainability, or how to live greener. What would you like to learn?" },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const response = aiGuideResponses[text] || "That's a great question! Here's what I know: every small eco action adds up. Try exploring our lessons and missions to learn more about this topic, and you'll earn XP while doing it! 🌿";
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
      setTyping(false);
    }, 800);
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <PageHeader
        title="AI Eco Guide"
        icon={<Bot className="w-5 h-5" />}
        subtitle="Your personal sustainability assistant. Ask questions, get tips, and learn how to help the planet!"
      />

      {/* Chat */}
      <Card className="p-0 overflow-hidden flex flex-col h-[500px]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-slide-up`}>
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                msg.role === 'ai' ? 'bg-gradient-to-br from-leaf-400 to-lagoon-500 text-white' : 'bg-leaf-100 text-leaf-600'
              }`}>
                {msg.role === 'ai' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              <div className={`max-w-[75%] rounded-2xl p-4 ${
                msg.role === 'ai' ? 'bg-leaf-50 text-leaf-800' : 'bg-lagoon-500 text-white'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-leaf-400 to-lagoon-500 text-white flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-leaf-50 rounded-2xl p-4 flex gap-1">
                <span className="w-2 h-2 bg-leaf-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                <span className="w-2 h-2 bg-leaf-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <span className="w-2 h-2 bg-leaf-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="px-6 pb-3">
            <div className="text-xs font-bold text-leaf-600/60 mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Try asking:
            </div>
            <div className="flex flex-wrap gap-2">
              {aiGuideSuggestions.map(s => (
                <button
                  key={s.id}
                  onClick={() => handleSend(s.text)}
                  className="text-sm bg-leaf-50 hover:bg-leaf-100 text-leaf-700 rounded-full px-3 py-1.5 font-medium transition-colors flex items-center gap-1.5"
                >
                  <span>{s.emoji}</span> {s.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-leaf-100/50 flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend(input)}
            placeholder="Ask about the environment..."
            className="flex-1 bg-cream-50 border border-leaf-100 rounded-2xl px-4 py-3 text-leaf-800 placeholder:text-leaf-600/40 focus:outline-none focus:border-leaf-400 focus:ring-2 focus:ring-leaf-100 transition-all"
          />
          <Button onClick={() => handleSend(input)} icon={<Send className="w-4 h-4" />}>
            Send
          </Button>
        </div>
      </Card>
    </div>
  );
}
