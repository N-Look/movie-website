import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import {
  Send,
  User,
  Bot,
  Film,
  Tv,
  MessageSquare,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus,
  LogIn,
  Clock,
} from "lucide-react";
import { sendChatMessage, resetConversation, setConversationHistory } from "../lib/AIModel";
import { loadUserChats, saveChat, deleteChat } from "../lib/chatHistory";
import { useAuthStore } from "../store/authStore";

const TMDB_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NTgzMDFlZGQ2MGEzN2Y3NDlmMzhlNGFmMTJjZDE3YSIsIm5iZiI6MTc0NTQxNjIyNS44NzY5OTk5LCJzdWIiOiI2ODA4ZjAyMTI3NmJmNjRlNDFhYjY0ZWUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.NA_LMt6-MUBLAvxMRkZtBoUif4p9YQ6aYZo-lv4-PUE",
  },
};

const EXAMPLE_PROMPTS = [
  "Give me movies like The Avengers",
  "Something from the 2010s with a mind-bending plot",
  "I want a feel-good comedy for tonight",
  "Show me thrillers with crazy plot twists",
  "What are some underrated sci-fi movies?",
  "I liked Inception, what else would I enjoy?",
];

const generateChatId = () => `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const getChatTitle = (messages) => {
  const firstUserMessage = messages.find((m) => m.role === "user");
  if (!firstUserMessage) return "New Chat";
  const content = firstUserMessage.content;
  return content.length > 40 ? content.substring(0, 40) + "..." : content;
};

// Login Required Component
const LoginRequired = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 mb-6">
            <Film className="w-8 h-8 text-purple-400" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-3">
            Sign in to get recommendations
          </h1>
          <p className="text-gray-400 mb-8 text-sm leading-relaxed">
            Get personalized movie and TV show recommendations. Your chat history is automatically saved.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/signin")}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-colors"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Recommendation Card Component
const RecommendationCard = ({ item, tmdbData }) => {
  const isLoading = !tmdbData;
  const hasData = tmdbData && !tmdbData.error;
  const linkPath = tmdbData?.id
    ? `/${item.type === "tv" ? "tv" : "movie"}/${tmdbData.id}`
    : "#";

  return (
    <Link
      to={hasData ? linkPath : "#"}
      className="group block"
    >
      <div className="relative bg-[#1a1a1a] rounded-xl overflow-hidden border border-white/5 hover:border-purple-500/30 transition-all duration-300 hover:scale-[1.02]">
        <div className="aspect-[2/3] relative overflow-hidden bg-[#0f0f0f]">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            </div>
          ) : hasData && tmdbData.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w300${tmdbData.poster_path}`}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Film className="w-8 h-8 text-gray-600" />
            </div>
          )}

          {/* Type Badge */}
          <div className="absolute top-2 left-2">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ${
              item.type === "tv" ? "bg-blue-500/80" : "bg-purple-500/80"
            } text-white`}>
              {item.type === "tv" ? "TV" : "Movie"}
            </span>
          </div>

          {/* Rating */}
          {hasData && tmdbData.vote_average > 0 && (
            <div className="absolute top-2 right-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-yellow-500/90 text-black">
                {tmdbData.vote_average.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        <div className="p-3">
          <h4 className="font-medium text-white text-sm truncate">
            {hasData ? tmdbData.title || tmdbData.name : item.title}
          </h4>
          <p className="text-xs text-gray-500 mt-1">
            {hasData
              ? (tmdbData.release_date || tmdbData.first_air_date || "").slice(0, 4)
              : item.year}
          </p>
          {item.reason && (
            <p className="text-xs text-gray-600 mt-2 line-clamp-2">{item.reason}</p>
          )}
        </div>
      </div>
    </Link>
  );
};

// Chat Message Component
const ChatMessage = ({ message, isUser, recommendations, tmdbDataMap }) => {
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? "bg-purple-600" : "bg-[#2a2a2a]"
        }`}
      >
        {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-gray-400" />}
      </div>

      <div className={`flex-1 max-w-[90%] ${isUser ? "text-right" : ""}`}>
        <div
          className={`inline-block rounded-2xl px-4 py-3 ${
            isUser
              ? "bg-purple-600 text-white rounded-tr-sm"
              : "bg-[#1a1a1a] text-gray-200 border border-white/5 rounded-tl-sm"
          }`}
        >
          <p className="text-sm leading-relaxed">{message}</p>
        </div>

        {!isUser && recommendations && recommendations.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {recommendations.map((item, index) => (
              <RecommendationCard
                key={`${item.title}-${index}`}
                item={item}
                tmdbData={tmdbDataMap[item.title]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Main Component
const AIRecommendations = () => {
  const { user, fetchingUser } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tmdbDataMap, setTmdbDataMap] = useState({});
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  // Load chat history from Supabase
  useEffect(() => {
    const loadHistory = async () => {
      if (user?.id) {
        setIsLoadingHistory(true);
        const history = await loadUserChats(user.id);
        setChatHistory(history);
        setIsLoadingHistory(false);
      }
    };
    loadHistory();
  }, [user?.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Debounced save
  const debouncedSave = (chatData) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(async () => {
      if (user?.id && chatData.id && chatData.messages.length > 0) {
        await saveChat(user.id, chatData);
        setChatHistory((prev) => {
          const exists = prev.find((c) => c.id === chatData.id);
          if (exists) {
            return prev.map((c) => c.id === chatData.id ? { ...chatData, timestamp: exists.timestamp } : c);
          }
          return [{ ...chatData, timestamp: Date.now() }, ...prev];
        });
      }
    }, 1000);
  };

  useEffect(() => {
    if (messages.length > 0 && currentChatId && user?.id) {
      debouncedSave({ id: currentChatId, title: getChatTitle(messages), messages, tmdbDataMap });
    }
  }, [messages, tmdbDataMap, currentChatId, user?.id]);

  useEffect(() => {
    return () => { if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current); };
  }, []);

  const fetchTMDBData = async (recommendations) => {
    const newDataMap = { ...tmdbDataMap };
    await Promise.all(
      recommendations.map(async (item) => {
        if (newDataMap[item.title]) return;
        const searchType = item.type === "tv" ? "tv" : "movie";
        const url = `https://api.themoviedb.org/3/search/${searchType}?query=${encodeURIComponent(item.title)}&include_adult=false&language=en-US&page=1${item.year ? `&year=${item.year}` : ""}`;
        try {
          const res = await fetch(url, TMDB_OPTIONS);
          const data = await res.json();
          newDataMap[item.title] = data.results?.[0] || { error: true };
        } catch {
          newDataMap[item.title] = { error: true };
        }
      })
    );
    setTmdbDataMap(newDataMap);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    const chatId = currentChatId || generateChatId();
    if (!currentChatId) setCurrentChatId(chatId);

    setMessages((prev) => [...prev, { role: "user", content: trimmedInput }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await sendChatMessage(trimmedInput);
      if (response) {
        setMessages((prev) => [...prev, {
          role: "assistant",
          content: response.message || "Here are my recommendations!",
          recommendations: response.recommendations || [],
          isError: response.isError || false,
        }]);
        if (response.recommendations?.length > 0) fetchTMDBData(response.recommendations);
        if (response.isError) toast.error("Rate limit reached. Please wait.");
      } else {
        toast.error("Failed to get a response.");
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleNewChat = () => {
    resetConversation();
    setMessages([]);
    setTmdbDataMap({});
    setCurrentChatId(null);
    setInput("");
    inputRef.current?.focus();
  };

  const handleSelectChat = (chat) => {
    resetConversation();
    setMessages(chat.messages);
    setTmdbDataMap(chat.tmdbDataMap || {});
    setCurrentChatId(chat.id);
    const aiHistory = chat.messages.map((m) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.role === "user" ? m.content : JSON.stringify({ message: m.content, recommendations: m.recommendations || [] }),
    }));
    setConversationHistory(aiHistory);
  };

  const handleDeleteChat = async (chatId) => {
    if (user?.id) {
      const success = await deleteChat(user.id, chatId);
      if (success) {
        setChatHistory((prev) => prev.filter((c) => c.id !== chatId));
        if (currentChatId === chatId) handleNewChat();
        toast.success("Chat deleted");
      } else {
        toast.error("Failed to delete chat");
      }
    }
  };

  if (fetchingUser) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <LoginRequired />;

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white flex">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-72" : "w-0"
        } flex-shrink-0 transition-all duration-300 overflow-hidden border-r border-white/5 bg-[#0f0f0f]`}
      >
        <div className="w-72 h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <span className="font-medium text-sm text-gray-300">Chat History</span>
            <button
              onClick={handleNewChat}
              className="p-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors"
              title="New Chat"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {isLoadingHistory ? (
              <div className="flex justify-center py-8">
                <div className="w-5 h-5 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
              </div>
            ) : chatHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-600 text-sm">
                No conversations yet
              </div>
            ) : (
              chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  className={`group flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors ${
                    currentChatId === chat.id
                      ? "bg-purple-600/20 border border-purple-500/30"
                      : "hover:bg-white/5 border border-transparent"
                  }`}
                  onClick={() => handleSelectChat(chat)}
                >
                  <MessageSquare className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-300 truncate">{chat.title}</p>
                    <p className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {new Date(chat.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteChat(chat.id); }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 rounded transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-1.5 bg-[#1a1a1a] border border-white/10 rounded-r-lg hover:bg-[#252525] transition-colors"
        style={{ left: sidebarOpen ? "288px" : "0" }}
      >
        {sidebarOpen ? <ChevronLeft className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
      </button>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header - only show New button when there are messages */}
        {messages.length > 0 && (
          <header className="sticky top-0 z-10 bg-[#0b0b0b]/90 backdrop-blur-sm border-b border-white/5">
            <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-end">
              <button
                onClick={handleNewChat}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-gray-400 hover:text-white border border-white/5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New
              </button>
            </div>
          </header>
        )}

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <h2 className="text-2xl font-bold text-white mb-2">
                  What do you want to watch?
                </h2>
                <p className="text-gray-500 mb-8 max-w-md text-sm">
                  Describe your mood, a movie you liked, or the type of content you're looking for.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full max-w-2xl">
                  {EXAMPLE_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => { setInput(prompt); inputRef.current?.focus(); }}
                      className="text-left p-3 rounded-lg bg-[#1a1a1a] hover:bg-[#222] border border-white/5 hover:border-purple-500/30 text-sm text-gray-400 hover:text-white transition-all"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>

                {chatHistory.length > 0 && (
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="mt-8 text-sm text-gray-600 hover:text-gray-400 transition-colors"
                  >
                    {chatHistory.length} previous conversation{chatHistory.length !== 1 ? "s" : ""} in history
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((msg, index) => (
                  <ChatMessage
                    key={index}
                    message={msg.content}
                    isUser={msg.role === "user"}
                    recommendations={msg.recommendations}
                    tmdbDataMap={tmdbDataMap}
                  />
                ))}

                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center">
                      <Bot className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input */}
        <div className="sticky bottom-0 bg-[#0b0b0b] border-t border-white/5">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <form onSubmit={handleSubmit} className="relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe what you want to watch..."
                disabled={isLoading}
                className="w-full px-4 py-3 pr-12 bg-[#1a1a1a] border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-purple-500/50 transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendations;
