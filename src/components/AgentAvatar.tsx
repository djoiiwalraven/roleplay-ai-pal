
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot } from "lucide-react";

interface AgentAvatarProps {
  name: string;
  color?: string;
  size?: "sm" | "md" | "lg";
}

const AgentAvatar: React.FC<AgentAvatarProps> = ({ 
  name, 
  color = "#6366f1",
  size = "md" 
}) => {
  // Get initials from name
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
    
  const sizeClass = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };
  
  const iconSize = {
    sm: 14,
    md: 20,
    lg: 28,
  };

  return (
    <Avatar className={sizeClass[size]}>
      <AvatarFallback 
        style={{ backgroundColor: color }}
        className="text-white flex items-center justify-center"
      >
        {initials || <Bot size={iconSize[size]} />}
      </AvatarFallback>
    </Avatar>
  );
};

export default AgentAvatar;
