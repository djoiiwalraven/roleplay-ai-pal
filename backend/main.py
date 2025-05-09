from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from openai import OpenAI
import json
import os
from dotenv import load_dotenv, find_dotenv

# Load environment variables from .env file
load_dotenv(find_dotenv(), override=False)

client = OpenAI(
    api_key = os.environ["OPENAI_API_KEY"]
)

app = FastAPI()

# Path for storing agents data
AGENTS_FILE = 'agents.json'

# Load agents from JSON file
def load_agents():
    if os.path.exists(AGENTS_FILE):
        with open(AGENTS_FILE, 'r') as f:
            return json.load(f)
    else:
        return {}

# Save agents to JSON file
def save_agents(agents):
    with open(AGENTS_FILE, 'w') as f:
        json.dump(agents, f, indent=4)

# Pydantic model for agent creation
class Agent(BaseModel):
    name: str
    role: str
    goal: str
    backstory: str = None

class QueryRequest(BaseModel):
    agent_id: str
    question: str

# OpenAI GPT API call
def get_openai_response(details, prompt: str):
    print(details)
    try:
        response = client.responses.create(
            model="gpt-4o",  # Or you can use other models like `gpt-4` if available
            instructions=f'{details['role']},{details['goal']},{details['backstory']}',
            input=prompt
        )
        print(response)
        print("COMPLETION ABOVE")
        print()
        return response.output_text
    except:
        raise HTTPException(status_code=500, detail=f"Error from OpenAI")


# Endpoint to create a new agent
@app.post("/create_agent")
async def create_agent(agent: Agent):
    agents = load_agents()
    agent_id = str(len(agents) + 1)  # Generate a simple agent ID based on current length
    agents[agent_id] = agent.dict()  # Save agent details in dictionary
    save_agents(agents)
    return {"agent_id": agent_id, "message": "Agent created successfully"}

# Endpoint to ask an agent a question
@app.post("/ask_agent")
async def ask_agent(query: QueryRequest):
    agents = load_agents()
    agent = agents.get(query.agent_id)
    
    if not agent:
        raise HTTPException(status_code=505, detail="Agent not found")
    
    agent_details = {
        "role": agent["role"],
        "goal": agent["goal"],
        "backstory": agent['backstory']
    }

    # Query OpenAI API for the response
    answer = get_openai_response(agent_details, query.question)
    
    return {"answer": answer}

