from langgraph.prebuilt import create_react_agent

from app.agents.prompts import REQUIREMENTS_AGENT_SYSTEM_PROMPT
from app.agents.response_models.requirements_agent import RequirementsAgentResponseModel
from app.tools.flight_tools import search_flight_availability
from app.core.llm import llm


agent = create_react_agent(
    model=llm,
    tools=[search_flight_availability], 
    prompt=REQUIREMENTS_AGENT_SYSTEM_PROMPT, 
    response_format=RequirementsAgentResponseModel,
)

if __name__ == "__main__":
    for chunk in agent.stream(
        input={
            "messages": [
                "I want to go to Seoul(ICN) from Tokyo(NRT). My dates are flexible."
            ]
        },
        stream_mode="updates",
    ):
        print(chunk)
