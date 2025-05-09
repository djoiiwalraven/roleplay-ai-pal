
import React from "react";
import { Outlet } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import AgentList from "./AgentList";
import { useLocation } from "react-router-dom";

const Layout: React.FC = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const isRootPath = location.pathname === "/";

  // In mobile mode, we only show the agent list on the home route
  // and only show the chat interface on the chat routes
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Agent list - hidden on mobile when in a chat */}
      {(!isMobile || isRootPath) && (
        <div className={`${!isMobile ? "w-80" : "w-full"} h-full overflow-hidden`}>
          <AgentList />
        </div>
      )}

      {/* Chat interface - hidden on mobile when on home */}
      {(!isMobile || !isRootPath) && (
        <div className="flex-1 h-full overflow-hidden">
          <Outlet />
        </div>
      )}
    </div>
  );
};

export default Layout;
