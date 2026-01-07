import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Mic, Loader2, Bot, User, Volume2, Clock, MessageCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useConversation } from "@elevenlabs/react";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface TaxChatBotProps {
  open: boolean;
  onClose: () => void;
}

const quickQuestions = [
  "What is TIN and how do I get one?",
  "How much tax do I pay on N2 million salary?",
  "What items are VAT exempt?",
  "When is the tax filing deadline?",
  "Is my small business exempt from tax?",
  "What are the 2025 tax reform changes?",
];

const TaxChatBot = ({ open, onClose }: TaxChatBotProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isVoiceConnecting, setIsVoiceConnecting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ElevenLabs conversation hook for voice chat
  const conversation = useConversation({
    onConnect: () => {
      console.log("Voice connected");
      setIsVoiceConnecting(false);
      toast.success("Voice chat connected!");
    },
    onDisconnect: () => {
      console.log("Voice disconnected");
      setIsVoiceMode(false);
    },
    onMessage: (message) => {
      console.log("Voice message:", message);
    },
    onError: (error) => {
      console.error("Voice error:", error);
      toast.error("Voice chat error. Please try again.");
      setIsVoiceMode(false);
      setIsVoiceConnecting(false);
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("tax-chat", {
        body: {
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
        },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startVoiceChat = useCallback(async () => {
    setIsVoiceConnecting(true);
    try {
      // Request microphone permission first
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Get token from edge function
      const { data, error } = await supabase.functions.invoke("elevenlabs-conversation-token");

      if (error || !data?.token) {
        throw new Error(error?.message || "Failed to get voice token. Please ensure the ElevenLabs Agent ID is configured.");
      }

      // Start the conversation
      await conversation.startSession({
        conversationToken: data.token,
        connectionType: "webrtc",
      });

      setIsVoiceMode(true);
    } catch (error) {
      console.error("Voice start error:", error);
      toast.error(error instanceof Error ? error.message : "Could not start voice chat. Please check configuration.");
      setIsVoiceConnecting(false);
    }
  }, [conversation]);

  const stopVoiceChat = useCallback(async () => {
    await conversation.endSession();
    setIsVoiceMode(false);
  }, [conversation]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full h-full max-w-full max-h-full sm:max-w-full sm:max-h-full rounded-none flex flex-col p-0 gap-0 data-[state=open]:slide-in-from-bottom-0"  style={{ width: '100vw', height: '100vh', maxWidth: '100vw', maxHeight: '100vh' }}>
        {/* Header */}
        <DialogHeader className="p-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <DialogTitle className="flex items-center gap-2 font-display text-lg">
              <div className="w-8 h-8 rounded-full accent-gradient flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              NaijaTaxBot AI
            </DialogTitle>
            {messages.length > 0 && !isLoading && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    New Chat
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Start a new chat?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will clear your current conversation. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => setMessages([])}>
                      New Chat
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            {isVoiceMode && (
              <div className="flex items-center gap-2 text-sm text-primary ml-auto">
                <Volume2 className="w-4 h-4 animate-pulse" />
                <span>{conversation.isSpeaking ? "Speaking..." : "Listening..."}</span>
              </div>
            )}
          </div>
        </DialogHeader>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Empty state with quick questions */}
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-16 h-16 rounded-full accent-gradient flex items-center justify-center mb-4">
                <MessageCircle className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                Ask me anything about Nigerian taxes
              </h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                Get quick answers about the 2025 tax reforms, filing deadlines, exemptions, and more.
              </p>
              <div className="flex flex-wrap gap-2 justify-center max-w-md">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(question)}
                    className="px-3 py-2 text-sm bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full transition-colors text-left"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat messages */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === "user" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary text-secondary-foreground"
              }`}>
                {message.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-sm"
                  : "bg-secondary text-secondary-foreground rounded-tl-sm"
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-secondary rounded-2xl rounded-tl-sm px-4 py-3">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Voice mode indicator */}
        {isVoiceMode && (
          <div className="px-4 py-3 bg-primary/5 border-t border-primary/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full accent-gradient flex items-center justify-center">
                  <Mic className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="absolute inset-0 rounded-full accent-gradient animate-pulse-ring" />
              </div>
              <span className="text-sm font-medium">Voice chat active - speak to ask questions</span>
            </div>
            <Button variant="outline" size="sm" onClick={stopVoiceChat}>
              End Voice
            </Button>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="relative group">
              <Button
                variant="outline"
                size="icon"
                disabled={true}
                className="opacity-50 cursor-not-allowed"
                title="Voice AI coming soon"
              >
                <Mic className="w-4 h-4" />
              </Button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-border">
                <Clock className="w-3 h-3 inline mr-1" />
                Voice AI coming soon
              </div>
            </div>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your tax question..."
              disabled={isLoading || isVoiceMode}
              className="flex-1"
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isLoading || isVoiceMode}
              className="accent-gradient text-primary-foreground"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Educational tool only. Consult a tax professional for specific advice.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaxChatBot;
