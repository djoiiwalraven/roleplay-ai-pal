import React, { useEffect, useRef, useState } from "react";
import { useAgents } from "../context/AgentContext";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Bot, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ChatMessage from "./ChatMessage";
import { useIsMobile } from "@/hooks/use-mobile";
import AgentAvatar from "./AgentAvatar";

const ChatInterface: React.FC = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const { agents, getConversation, addMessage, updateAgentInteraction } = useAgents();
  const [message, setMessage] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Find the current agent
  const agent = agents.find((a) => a.id === agentId);
  
  // Get the conversation for this agent
  const conversation = agentId ? getConversation(agentId) : null;
  const messages = conversation?.messages || [];

  // Update agent interaction time when opening the chat
  useEffect(() => {
    if (agentId) {
      updateAgentInteraction(agentId);
    }
  }, [agentId, updateAgentInteraction]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [agentId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !agentId) return;
    
    // Add user message
    addMessage(agentId, message.trim(), 'user');
    setMessage("");

    const agent = agents.find((a) => a.id === agentId);
    if (!agent) {
      addMessage(agentId, "Error: Agent not found.", 'agent');
      return;
    }
    
    console.log(agentId)

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2 * 60 * 1000);

    try {
      const response = await fetch('https://backend-adu8.onrender.com:8000/ask_agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent_id: agentId,
          question: message.trim()
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId)

      if (!response.ok) {
        addMessage(agentId, "Error unable to get a response..", 'agent');
        return;
      }

      const data = await response.json();
      console.log(data)
      const agentAnswer = data.answer
      addMessage(agentId, agentAnswer, 'agent');
    } catch (error){
      if (error.name === 'AbortError') {
        // If request is aborted due to timeout
        addMessage(agentId, "Error: The request took too long to respond.", 'agent');
      } else {
        // If some other error occurs
        addMessage(agentId, "Error: An error occurred while communicating with the agent.", 'agent');
      }
    }
  };

  // If agent not found, show a message
  if (!agent || !agentId) {
    return (
      <div className="flex flex-1 items-center justify-center bg-gray-50">
        <div className="text-center">
          <Bot className="mx-auto h-12 w-12 text-gray-300" />
          <h2 className="mt-2 text-xl font-semibold">No agent selected</h2>
          <p className="text-gray-500 mt-1">Select an agent to start chatting</p>
          <Button 
            className="mt-4 bg-agent-primary hover:bg-agent-accent"
            onClick={() => navigate('/')}
          >
            Go to Agent List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 p-3 border-b">
        {isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/')}
            className="shrink-0"
          >
            <ArrowLeft size={20} />
          </Button>
        )}
        <AgentAvatar name={agent.name} color={agent.avatarColor} size="sm" />
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-lg truncate">{agent.name}</h2>
          <p className="text-sm text-gray-500 truncate">{agent.role}</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <div className="bg-gray-100 p-3 rounded-full mb-3">
              <Bot className="h-8 w-8 text-agent-primary" />
            </div>
            <h3 className="text-lg font-medium">Chat with {agent.name}</h3>
            <p className="text-gray-500 max-w-sm mt-1">
              {agent.goal}
            </p>
            {agent.backstory && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg max-w-md text-sm text-gray-600">
                <strong className="block mb-1">Backstory:</strong>
                {agent.backstory}
              </div>
            )}
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} agent={agent} />
          ))
        )}
      </div>

      {/* Message Input */}
      <form 
        onSubmit={handleSendMessage} 
        className="border-t p-3 flex items-center gap-2"
      >
        <Input
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button 
          type="submit" 
          size="icon"
          disabled={!message.trim()} 
          className="bg-agent-primary hover:bg-agent-accent"
        >
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
};

export default ChatInterface;
