import json
from typing import Optional

from langchain.messages import HumanMessage, AIMessage
from langgraph.graph import StateGraph, MessagesState, START, END
from langgraph.types import interrupt, Command
from langgraph.checkpoint.memory import InMemorySaver

from app.agents.travel_system_agents import requirements_agent, planner_agent, booker_agent


checkpointer = InMemorySaver()


class TravelSystemState(MessagesState):
    requirements_complete: bool
    interruption_message: str
    requirements: Optional[dict]
    itinerary_complete: bool
    itinerary: Optional[dict]
    booking_complete: bool
    bookings: Optional[dict]


def requirements_agent_node(state: TravelSystemState) -> TravelSystemState:
    response = requirements_agent.invoke({"messages": state["messages"]})

    response = response["structured_response"]
    requirements_response = response.requirements

    if requirements_response.missing_info.question != "":
        return {
            "messages": [
                AIMessage(content=requirements_response.missing_info.question)
            ],
            "interruption_message": requirements_response.missing_info.question,
            "requirements_complete": False,
            "requirements": None,
            "itinerary_complete": False,
            "itinerary": None,
            "booking_complete": False,
            "bookings": None
        }

    # Store complete requirements as dict in state
    return {
        "messages": [
            AIMessage(content="Perfect! I have gathered all your requirements. Let me plan the itinerary for you now.")
        ],
        "requirements_complete": True,
        "interruption_message": "",
        "requirements": requirements_response.model_dump(),
        "itinerary_complete": False,
        "itinerary": None,
        "booking_complete": False,
        "bookings": None
    }


def should_ask_user_for_info(state: TravelSystemState) -> str:
    if not state["requirements_complete"]:
        return "ask_user_for_info"
    return "planner_agent"


def ask_user_for_info(state: TravelSystemState) -> TravelSystemState:
    user_response = interrupt(state["interruption_message"])

    return {
        "messages": [HumanMessage(content=user_response)],
        "interruption_message": "",
    }


def planner_agent_node(state: TravelSystemState) -> TravelSystemState:
    req = state["requirements"]
    prompt = f"Please create an itinerary for the following requirements: {json.dumps(req)}"
    
    response = planner_agent.invoke({"messages": [HumanMessage(content=prompt)]})
    response = response["structured_response"]
    
    return {
        "messages": [
            AIMessage(content="I have created a wonderful itinerary. Moving on to booking your flights and hotels!")
        ],
        "itinerary_complete": True,
        "itinerary": response.itinerary.model_dump()
    }


def booker_agent_node(state: TravelSystemState) -> TravelSystemState:
    req = state["requirements"]
    itinerary = state["itinerary"]
    
    prompt = f"Please confirm the bookings. Requirements: {json.dumps(req)}. Itinerary: {json.dumps(itinerary)}"
    
    response = booker_agent.invoke({"messages": [HumanMessage(content=prompt)]})
    response = response["structured_response"]
    
    return {
        "messages": [
            AIMessage(content="Your bookings have been confirmed! Everything is ready for your trip.")
        ],
        "booking_complete": True,
        "bookings": response.bookings.model_dump()
    }


graph = StateGraph(TravelSystemState)
graph.add_node("requirements_agent", requirements_agent_node)
graph.add_node("ask_user_for_info", ask_user_for_info)
graph.add_node("planner_agent", planner_agent_node)
graph.add_node("booker_agent", booker_agent_node)

graph.add_edge(START, "requirements_agent")
graph.add_conditional_edges(
    "requirements_agent",
    should_ask_user_for_info,
    {"ask_user_for_info": "ask_user_for_info", "planner_agent": "planner_agent"},
)
graph.add_edge("ask_user_for_info", "requirements_agent")
graph.add_edge("planner_agent", "booker_agent")
graph.add_edge("booker_agent", END)

travel_graph = graph.compile(checkpointer=checkpointer)
