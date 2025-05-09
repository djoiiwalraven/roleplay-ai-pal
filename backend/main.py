from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
import requests
import json
import os

app = FastAPI()

# Paths for agents data and the API keys
AGENTS_FILE = 'agents.json'
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"


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
def get_openai_response(prompt: str):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {OPENAI_API_KEY}",
    }
    payload = {
        "model": "gpt-4",
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 1000,
    }
    response = requests.post(OPENAI_API_URL, json=payload, headers=headers)
    if response.status_code == 200:
        return response.json()["choices"][0]["message"]["content"]
    else:
        raise HTTPException(status_code=response.status_code, detail="Error from OpenAI API")

# Anthropic API call
def get_anthropic_response(prompt: str):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {ANTHROPIC_API_KEY}",
    }
    payload = {
        "model": "claude-3",  # Replace with the correct model name
        "prompt": prompt,
        "max_tokens_to_sample": 1000,
    }
    response = requests.post(ANTHROPIC_API_URL, json=payload, headers=headers)
    if response.status_code == 200:
        return response.json()["completion"]
    else:
        raise HTTPException(status_code=response.status_code, detail="Error from Anthropic API")

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
        raise HTTPException(status_code=404, detail="Agent not found")
    
    # Construct the prompt using agent's information and user's question
    prompt = f"Agent Name: {agent['name']}\nRole: {agent['role']}\nGoal: {agent['goal']}\n"
    if agent['backstory']:
        prompt += f"Backstory: {agent['backstory']}\n"
    prompt += f"User's Question: {query.question}"

    # Query OpenAI or Anthropic (can switch between them based on your preference)
    try:
        # For OpenAI
        answer = get_openai_response(prompt)
        # Uncomment the line below for Anthropic
        # answer = get_anthropic_response(prompt)
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)
    
    return {"answer": answer}

