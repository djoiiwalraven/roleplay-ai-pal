
import React, { createContext, useState, useContext, useEffect } from "react";
import { Agent, Conversation } from "../types/agent";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface AgentContextType {
  agents: Agent[];
  conversations: Record<string, Conversation>;
  addAgent: (agent: Omit<Agent, "id" | "createdAt" | "avatarColor">) => void;
  deleteAgent: (id: string) => void;
  getConversation: (agentId: string) => Conversation;
  addMessage: (agentId: string, content: string, sender: 'user' | 'agent') => void;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

const AVATAR_COLORS = [
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#06b6d4", // cyan
  "#3b82f6", // blue
];

export const AgentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [conversations, setConversations] = useState<Record<string, Conversation>>({});

  // Load agents from localStorage on initial load
  useEffect(() => {
    const storedAgents = localStorage.getItem("agents");
    const storedConversations = localStorage.getItem("conversations");
    
    if (storedAgents) {
      try {
        const parsedAgents = JSON.parse(storedAgents);
        // Convert string dates back to Date objects
        const agentsWithDates = parsedAgents.map((agent: any) => ({
          ...agent,
          createdAt: new Date(agent.createdAt)
        }));
        setAgents(agentsWithDates);
      } catch (error) {
        console.error("Failed to parse stored agents:", error);
        // Clear corrupted data
        localStorage.removeItem("agents");
      }
    }

    if (storedConversations) {
      try {
        const parsedConversations = JSON.parse(storedConversations);
        // Convert string dates back to Date objects for conversations
        const conversationsWithDates: Record<string, Conversation> = {};
        
        Object.keys(parsedConversations).forEach((key) => {
          const conversation = parsedConversations[key];
          conversationsWithDates[key] = {
            ...conversation,
            lastUpdated: new Date(conversation.lastUpdated),
            messages: conversation.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }))
          };
        });
        
        setConversations(conversationsWithDates);
      } catch (error) {
        console.error("Failed to parse stored conversations:", error);
        localStorage.removeItem("conversations");
      }
    }
  }, []);

  // Save agents to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("agents", JSON.stringify(agents));
  }, [agents]);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("conversations", JSON.stringify(conversations));
  }, [conversations]);

  const addAgent = (agentData: Omit<Agent, "id" | "createdAt" | "avatarColor">) => {
    const newAgent: Agent = {
      ...agentData,
      id: uuidv4(),
      createdAt: new Date(),
      // Randomly select a color from the list
      avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]
    };

    setAgents((prev) => [...prev, newAgent]);
    
    // Create an empty conversation for the new agent
    const newConversation: Conversation = {
      id: uuidv4(),
      agentId: newAgent.id,
      messages: [],
      lastUpdated: new Date()
    };
    
    setConversations((prev) => ({
      ...prev,
      [newAgent.id]: newConversation
    }));

    toast.success(`${newAgent.name} has been created!`);
    return newAgent;
  };

  const deleteAgent = (id: string) => {
    setAgents((prev) => prev.filter((agent) => agent.id !== id));
    
    // Delete associated conversation
    setConversations((prev) => {
      const newConversations = { ...prev };
      delete newConversations[id];
      return newConversations;
    });
    
    toast.success("Agent has been deleted");
  };

  const getConversation = (agentId: string): Conversation => {
    // If conversation doesn't exist, create one
    if (!conversations[agentId]) {
      const newConversation: Conversation = {
        id: uuidv4(),
        agentId,
        messages: [],
        lastUpdated: new Date()
      };
      
      setConversations((prev) => ({
        ...prev,
        [agentId]: newConversation
      }));
      
      return newConversation;
    }
    
    return conversations[agentId];
  };

  const addMessage = (agentId: string, content: string, sender: 'user' | 'agent') => {
    const message = {
      id: uuidv4(),
      content,
      sender,
      timestamp: new Date()
    };

    setConversations((prev) => {
      const conversation = prev[agentId] || {
        id: uuidv4(),
        agentId,
        messages: [],
        lastUpdated: new Date()
      };

      return {
        ...prev,
        [agentId]: {
          ...conversation,
          messages: [...conversation.messages, message],
          lastUpdated: new Date()
        }
      };
    });
  };

  return (
    <AgentContext.Provider
      value={{ 
        agents, 
        conversations, 
        addAgent, 
        deleteAgent,
        getConversation,
        addMessage
      }}
    >
      {children}
    </AgentContext.Provider>
  );
};

export const useAgents = () => {
  const context = useContext(AgentContext);
  if (context === undefined) {
    throw new Error("useAgents must be used within an AgentProvider");
  }
  return context;
};
