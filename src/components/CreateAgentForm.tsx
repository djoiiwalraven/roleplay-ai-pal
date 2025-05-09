
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAgents } from "../context/AgentContext";
import { useNavigate } from "react-router-dom";
import { Bot } from "lucide-react";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  role: z.string().min(1, "Role is required").max(50, "Role is too long"),
  goal: z.string().min(1, "Goal is required").max(200, "Goal is too long"),
  backstory: z.string().max(500, "Backstory is too long").optional(),
});

type FormData = z.infer<typeof formSchema>;

interface CreateAgentFormProps {
  onSuccess?: () => void;
}

const CreateAgentForm: React.FC<CreateAgentFormProps> = ({ onSuccess }) => {
  const { addAgent } = useAgents();
  const navigate = useNavigate();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      role: "",
      goal: "",
      backstory: "",
    },
  });

  const onSubmit = (data: FormData) => {
    // Ensure all required fields are provided to addAgent
    const newAgent = addAgent({
      name: data.name,
      role: data.role,
      goal: data.goal,
      backstory: data.backstory || undefined,
    });
    
    if (onSuccess) onSuccess();
    navigate(`/chat/${newAgent.id}`);
  };

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Bot className="text-agent-primary" size={20} />
          Create New AI Agent
        </DialogTitle>
        <DialogDescription>
          Create a specialized AI agent with a specific role and goal
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Marketing Expert" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Digital Marketing Specialist" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="goal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Goal</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Help create marketing strategies" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="backstory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Backstory (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., 15 years of experience in digital marketing for tech startups..."
                    {...field}
                    rows={4}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onSuccess}>
              Cancel
            </Button>
            <Button type="submit" className="bg-agent-primary hover:bg-agent-accent">
              Create Agent
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
};

export default CreateAgentForm;
