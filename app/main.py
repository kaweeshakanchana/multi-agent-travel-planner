from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional
from langchain.messages import HumanMessage, AIMessage
from langgraph.types import Command
import uuid
import os

from app.agents.travel_system_graph import travel_graph

app = FastAPI()

class ChatRequest(BaseModel):
    thread_id: Optional[str] = None
    message: str

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    thread_id = request.thread_id or str(uuid.uuid4())
    config = {"configurable": {"thread_id": thread_id}}
    
    state_snapshot = travel_graph.get_state(config)
    
    if state_snapshot and getattr(state_snapshot, 'tasks', None) and state_snapshot.tasks[0].interrupts:
        # Resume the interrupted node
        travel_graph.invoke(Command(resume=request.message), config)
    else:
        # Start fresh or continuing
        travel_graph.invoke({"messages": [HumanMessage(content=request.message)]}, config)
        
    state_snapshot = travel_graph.get_state(config)
    values = state_snapshot.values
    
    response_text = ""
    # If there's an active interrupt, return the interruption_message
    if getattr(state_snapshot, 'tasks', None) and state_snapshot.tasks[0].interrupts:
        interrupts = state_snapshot.tasks[0].interrupts
        response_text = interrupts[0].value
    else:
        # Get the latest AIMessage
        for msg in reversed(values.get("messages", [])):
            if isinstance(msg, AIMessage):
                response_text = msg.content
                break

    return {
        "thread_id": thread_id,
        "response": response_text,
        "requirements": values.get("requirements"),
        "itinerary": values.get("itinerary"),
        "bookings": values.get("bookings"),
        "is_finished": len(state_snapshot.next) == 0
    }

# Ensure frontend dir exists, otherwise tests fail before we create it
os.makedirs("frontend", exist_ok=True)
app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
