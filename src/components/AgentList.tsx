
import React from "react";
import { useAgents } from "../context/AgentContext";
import AgentListItem from "./AgentListItem";
import { useParams } from "react-router-dom";
import { Plus, BotMessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import CreateAgentForm from "./CreateAgentForm";

const AgentList: React.FC = () => {
  const { agents } = useAgents();
  const { agentId } = useParams<{ agentId: string }>();
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col h-full bg-white border-r">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">My Agents</h2>
      </div>

      {/* Agent List */}
      <div className="flex-1 overflow-y-auto">
        {agents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <BotMessageSquare className="w-12 h-12 text-gray-300 mb-2" />
            <h3 className="text-lg font-medium text-gray-900">No agents yet</h3>
            <p className="text-gray-500 mt-1">Create your first AI agent to get started</p>
          </div>
        ) : (
          agents
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .map((agent) => (
              <AgentListItem 
                key={agent.id} 
                agent={agent} 
                isActive={agentId === agent.id} 
              />
            ))
        )}
      </div>

      {/* Create Agent Button */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button 
            className="m-4 gap-2 bg-agent-primary hover:bg-agent-accent"
            size="lg"
          >
            <Plus size={18} />
            <span>New Agent</span>
          </Button>
        </DialogTrigger>
        <CreateAgentForm onSuccess={() => setOpen(false)} />
      </Dialog>
    </div>
  );
};

export default AgentList;
