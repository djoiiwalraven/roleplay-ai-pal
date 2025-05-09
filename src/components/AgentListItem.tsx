
import React from "react";
import { Link } from "react-router-dom";
import { Agent } from "../types/agent";
import AgentAvatar from "./AgentAvatar";
import { cn } from "@/lib/utils";

interface AgentListItemProps {
  agent: Agent;
  isActive?: boolean;
}

const AgentListItem: React.FC<AgentListItemProps> = ({ agent, isActive = false }) => {
  return (
    <Link 
      to={`/chat/${agent.id}`}
      className={cn(
        "flex items-center p-3 gap-3 border-b border-gray-100 hover:bg-gray-50 transition-colors",
        isActive && "bg-gray-50"
      )}
    >
      <AgentAvatar name={agent.name} color={agent.avatarColor} />
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-medium text-gray-900 truncate">{agent.name}</h3>
        <p className="text-sm text-gray-500 truncate">{agent.role}</p>
      </div>
    </Link>
  );
};

export default AgentListItem;
