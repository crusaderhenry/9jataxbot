import { MessageCircle } from "lucide-react";

const ChatButton = () => {
  return (
    <button
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-chat hover:bg-chat-hover shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 animate-float"
      aria-label="Open chat"
    >
      <MessageCircle className="w-6 h-6 text-foreground" />
    </button>
  );
};

export default ChatButton;
