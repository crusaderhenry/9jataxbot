import { MessageCircle } from "lucide-react";

interface ChatButtonProps {
  onClick: () => void;
}

const ChatButton = ({ onClick }: ChatButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full accent-gradient hover:opacity-90 shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 animate-float group"
      aria-label="Open tax chat bot"
    >
      <MessageCircle className="w-6 h-6 text-primary-foreground" />
      <span className="absolute right-full mr-3 px-3 py-1.5 bg-foreground text-background text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Ask Tax Bot
      </span>
    </button>
  );
};

export default ChatButton;
