
import React from "react";
import { Plus, BotMessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import CreateAgentForm from "./CreateAgentForm";

const CreateAgentFab: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="fixed right-4 bottom-4 w-14 h-14 rounded-full shadow-lg bg-agent-primary hover:bg-agent-accent"
          size="icon"
        >
          <div className="relative">
            <Plus className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" size={24} />
            <BotMessageSquare className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-50 opacity-50" size={24} />
          </div>
        </Button>
      </DialogTrigger>
      <CreateAgentForm 
        onSuccess={() => {
          setOpen(false);
        }} 
      />
    </Dialog>
  );
};

export default CreateAgentFab;
