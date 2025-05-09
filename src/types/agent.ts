
export interface Agent {
  id: string;
  name: string;
  role: string;
  goal: string;
  backstory?: string;
  avatarColor: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

export interface Conversation {
  id: string;
  agentId: string;
  messages: Message[];
  lastUpdated: Date;
}
