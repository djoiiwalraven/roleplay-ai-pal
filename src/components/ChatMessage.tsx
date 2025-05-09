
import React from "react";
import { Message } from "../types/agent";
import AgentAvatar from "./AgentAvatar";
import { Agent } from "../types/agent";
import { User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: Message;
  agent?: Agent;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, agent }) => {
  const isUser = message.sender === 'user';
  
  // Format timestamp
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={cn(
      "flex gap-3 p-4",
      isUser ? "justify-end" : "justify-start",
      !isUser && "bg-gray-50"
    )}>
      {!isUser && agent && (
        <AgentAvatar name={agent.name} color={agent.avatarColor} size="sm" />
      )}
      
      <div className={cn(
        "flex flex-col max-w-[75%]",
        isUser ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "rounded-lg px-4 py-2",
          isUser 
            ? "bg-agent-primary text-white rounded-br-none" 
            : "bg-white border border-gray-200 rounded-bl-none"
        )}>
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>
        <span className="text-xs text-gray-500 mt-1">
          {formatTime(message.timestamp)}
        </span>
      </div>
      
      {isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-gray-200 text-gray-600">
            <User size={14} />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
