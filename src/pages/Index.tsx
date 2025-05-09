
import React, { useEffect } from "react";
import { useAgents } from "../context/AgentContext";
import { useNavigate } from "react-router-dom";
import WelcomePage from "./WelcomePage";
import CreateAgentFab from "@/components/CreateAgentFab";

const Index = () => {
  const { agents } = useAgents();
  const navigate = useNavigate();

  // If there are agents, we'll redirect to the first one
  useEffect(() => {
    if (agents.length > 0) {
      // No need to redirect - the layout will handle showing the agents list
    } else {
      // No need to redirect - the layout will show the welcome page
    }
  }, [agents, navigate]);

  if (agents.length === 0) {
    return <WelcomePage />;
  }

  return (
    <div className="flex items-center justify-center h-full bg-gray-50">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Select an Agent</h2>
        <p className="text-gray-500">Choose an agent from the list to start chatting</p>
      </div>
      <CreateAgentFab />
    </div>
  );
};

export default Index;
