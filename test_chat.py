import asyncio
import uuid
import sys
import os
import langchain
langchain.debug = True

# Set up to run the graph directly
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.agents.travel_system_graph import travel_graph
from langchain.messages import HumanMessage

def test_flow():
    thread_id = str(uuid.uuid4())
    config = {"configurable": {"thread_id": thread_id}}
    
    print("Sending msg 1...")
    msg1 = "I want to travel UK to Srilanka"
    travel_graph.invoke({"messages": [HumanMessage(content=msg1)]}, config)
    state = travel_graph.get_state(config)
    print("State 1:", state)
    if getattr(state, 'tasks', None) and state.tasks[0].interrupts:
        print("Interrupt 1:", state.tasks[0].interrupts[0].value)
    
    print("\nSending msg 2...")
    msg2 = "3/12/2026"
    travel_graph.invoke({"messages": [HumanMessage(content=msg2)]}, config)
    state = travel_graph.get_state(config)
    print("State 2:", state)
    if getattr(state, 'tasks', None) and state.tasks[0].interrupts:
        print("Interrupt 2:", state.tasks[0].interrupts[0].value)

if __name__ == "__main__":
    test_flow()
