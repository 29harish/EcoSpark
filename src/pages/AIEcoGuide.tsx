import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/layout/PageHeader';
import { aiGuideSuggestions } from '@/data/mockData';
import { apiRequest } from '@/lib/api';
import {
  Bot,
  Send,
  Sparkles,
  User,
  Trash2,
  Copy,
  Check,
  RefreshCw,
  Lightbulb,
  Leaf,
  Recycle,
  Droplets,
  Zap,
  Target,
} from 'lucide-react';

interface Message {
  role: 'user' | 'ai';
  text: string;
  error?: boolean;
}

const WELCOME_MESSAGE =
  "Hi there! I'm your AI Eco Guide 🌱 Ask me anything about the environment, sustainability, or how to live greener. What would you like to learn?";

const QUICK_ACTIONS = [
  {
    label: 'Eco Tip',
    icon: <Lightbulb className="w-4 h-4" />,
    prompt: 'Give me one simple eco-friendly tip I can try today.',
  },
  {
    label: 'Recycling',
    icon: <Recycle className="w-4 h-4" />,
    prompt: 'Teach me something useful about recycling.',
  },
  {
    label: 'Save Water',
    icon: <Droplets className="w-4 h-4" />,
    prompt: 'What are some easy ways students can save water?',
  },
  {
    label: 'Save Energy',
    icon: <Zap className="w-4 h-4" />,
    prompt: 'How can I reduce my electricity usage at home?',
  },
  {
    label: 'Eco Challenge',
    icon: <Target className="w-4 h-4" />,
    prompt: 'Give me a fun environmental challenge I can complete today.',
  },
];

export function AIEcoGuide() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      text: WELCOME_MESSAGE,
    },
  ]);

  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  const handleSend = async (text: string) => {
    if (!text.trim() || typing) return;

    const userMessage = text.trim();

    const history = messages
      .filter((message) => message.text !== WELCOME_MESSAGE)
      .filter((message) => !message.error)
      .map((message) => ({
        role:
          message.role === 'ai'
            ? ('assistant' as const)
            : ('user' as const),
        content: message.text,
      }));

    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        text: userMessage,
      },
    ]);

    setInput('');
    setTyping(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      const data = await apiRequest('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message: userMessage, history }),
      });

      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: data.reply,
        },
      ]);
    } catch (error) {
      console.error('Eco Guide error:', error);

      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: "Sorry, I couldn't connect right now. Please try again. 🌱",
          error: true,
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  const clearConversation = () => {
    if (typing) return;

    setMessages([
      {
        role: 'ai',
        text: WELCOME_MESSAGE,
      },
    ]);

    setInput('');
    setCopiedIndex(null);
  };

  const copyMessage = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);

      setCopiedIndex(index);

      setTimeout(() => {
        setCopiedIndex(null);
      }, 1500);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const retryLastMessage = () => {
    if (typing) return;

    const lastUserMessage = [...messages]
      .reverse()
      .find((message) => message.role === 'user');

    if (!lastUserMessage) return;

    setMessages((prev) => {
      const lastErrorIndex = [...prev]
        .map((message, index) => ({
          message,
          index,
        }))
        .reverse()
        .find(
          ({ message }) =>
            message.role === 'ai' && message.error
        )?.index;

      if (lastErrorIndex === undefined) {
        return prev;
      }

      return prev.filter(
        (_, index) => index !== lastErrorIndex
      );
    });

    handleSend(lastUserMessage.text);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend(input);
    }
  };

  const handleInput = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setInput(event.target.value);

    event.target.style.height = 'auto';
    event.target.style.height = `${Math.min(
      event.target.scrollHeight,
      120
    )}px`;
  };

  return (
    <div className="h-full p-4 md:p-8 max-w-5xl mx-auto overflow-hidden">
      <PageHeader
        title="AI Eco Guide"
      />

      <Card className="p-0 overflow-hidden flex flex-col h-[calc(100vh-210px)] min-h-[550px] max-h-[780px] shadow-xl shadow-leaf-900/5">
        {/* Header */}
        <div className="px-5 md:px-6 py-4 border-b border-leaf-100/60 bg-gradient-to-r from-leaf-50/80 to-lagoon-50/50">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-leaf-400 to-lagoon-500 text-white flex items-center justify-center shadow-md">
                  <Bot className="w-6 h-6" />
                </div>

                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white" />
              </div>

              <div>
                <div className="font-bold text-leaf-900">
                  EcoSpark AI
                </div>

                <div className="text-xs text-leaf-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Online 
                </div>
              </div>
            </div>

            <button
              onClick={clearConversation}
              disabled={typing || messages.length <= 1}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-leaf-600 hover:text-red-600 hover:bg-red-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              title="Clear conversation"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">
                Clear chat
              </span>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6 space-y-5">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`group flex gap-3 ${
                msg.role === 'user'
                  ? 'flex-row-reverse'
                  : ''
              } animate-slide-up`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'ai'
                    ? 'bg-gradient-to-br from-leaf-400 to-lagoon-500 text-white shadow-sm'
                    : 'bg-leaf-100 text-leaf-600'
                }`}
              >
                {msg.role === 'ai' ? (
                  <Bot className="w-5 h-5" />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </div>

              {/* Message */}
              <div
                className={`max-w-[82%] md:max-w-[72%] ${
                  msg.role === 'user'
                    ? 'items-end'
                    : 'items-start'
                } flex flex-col`}
              >
                <div
                  className={`rounded-2xl px-4 py-3.5 ${
                    msg.role === 'ai'
                      ? msg.error
                        ? 'bg-red-50 text-red-700 border border-red-100'
                        : 'bg-leaf-50 text-leaf-800 rounded-tl-sm'
                      : 'bg-lagoon-500 text-white rounded-tr-sm shadow-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {msg.text}
                  </p>
                </div>

                {/* AI actions */}
                {msg.role === 'ai' && !msg.error && i > 0 && (
                  <button
                    onClick={() =>
                      copyMessage(msg.text, i)
                    }
                    className="mt-1.5 ml-1 flex items-center gap-1.5 text-[11px] text-leaf-500 opacity-0 group-hover:opacity-100 transition-opacity hover:text-leaf-700"
                  >
                    {copiedIndex === i ? (
                      <>
                        <Check className="w-3 h-3" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copy
                      </>
                    )}
                  </button>
                )}

                {/* Retry */}
                {msg.error && (
                  <button
                    onClick={retryLastMessage}
                    disabled={typing}
                    className="mt-2 ml-1 flex items-center gap-1.5 text-xs font-semibold text-leaf-600 hover:text-leaf-800"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Try again
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {typing && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-leaf-400 to-lagoon-500 text-white flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>

              <div className="bg-leaf-50 rounded-2xl rounded-tl-sm px-4 py-3.5 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-leaf-400 rounded-full animate-bounce" />
                <span
                  className="w-2 h-2 bg-leaf-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.15s' }}
                />
                <span
                  className="w-2 h-2 bg-leaf-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.3s' }}
                />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Welcome / Quick actions */}
        {messages.length <= 1 && !typing && (
          <div className="px-4 md:px-6 pb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-leaf-600 mb-2.5">
              <Sparkles className="w-3.5 h-3.5" />
              Quick actions
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  onClick={() =>
                    handleSend(action.prompt)
                  }
                  className="flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold bg-white border border-leaf-100 hover:border-leaf-300 hover:bg-leaf-50 text-leaf-700 rounded-xl px-3 py-2 transition-all shadow-sm"
                >
                  {action.icon}
                  {action.label}
                </button>
              ))}
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs text-leaf-500">
              <Leaf className="w-3.5 h-3.5" />
              <span>Try asking:</span>

              {aiGuideSuggestions.slice(0, 2).map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSend(s.text)}
                  className="text-leaf-700 font-medium hover:underline"
                >
                  {s.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-3 md:p-4 border-t border-leaf-100/60 bg-white">
          <div className="flex items-end gap-2 bg-cream-50 border border-leaf-100 rounded-2xl p-1.5 focus-within:border-leaf-400 focus-within:ring-2 focus-within:ring-leaf-100 transition-all">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              disabled={typing}
              rows={1}
              maxLength={1000}
              placeholder="Ask your Eco Guide anything..."
              className="flex-1 resize-none bg-transparent px-3 py-2.5 text-sm text-leaf-800 placeholder:text-leaf-600/40 focus:outline-none disabled:opacity-60 max-h-[120px]"
            />

            <Button
              onClick={() => handleSend(input)}
              disabled={typing || !input.trim()}
              icon={
                typing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )
              }
              className="rounded-xl"
            >
              <span className="hidden sm:inline">
                {typing ? 'Thinking' : 'Send'}
              </span>
            </Button>
          </div>

          <div className="flex items-center justify-between px-2 pt-2">
            

            <span className="text-[10px] text-leaf-500/60">
              {input.length}/1000
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}