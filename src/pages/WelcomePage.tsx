
import React from "react";
import { Bot } from "lucide-react";
import CreateAgentFab from "@/components/CreateAgentFab";

const WelcomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-6">
      <div className="text-center">
        <div className="inline-block p-3 bg-agent-primary/10 rounded-full mb-4">
          <Bot size={40} className="text-agent-primary" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to AI Agent Chat</h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Create specialized AI agents with specific roles and start chatting with them.
        </p>
      </div>
      
      <div className="mt-12 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full max-w-4xl">
        {/* Feature cards */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="font-semibold text-lg mb-2">Create Custom Agents</h2>
          <p className="text-gray-600 text-sm">Define AI agents with specific roles, goals, and backstories to suit your needs.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="font-semibold text-lg mb-2">Chat Interface</h2>
          <p className="text-gray-600 text-sm">Interact with your AI agents through an intuitive messaging interface.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="font-semibold text-lg mb-2">Future LLM Integration</h2>
          <p className="text-gray-600 text-sm">Connect to AI models like OpenAI or Anthropic in the future.</p>
        </div>
      </div>

      <CreateAgentFab />
    </div>
  );
};

export default WelcomePage;
