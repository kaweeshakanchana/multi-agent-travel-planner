from langgraph.prebuilt import create_react_agent
import inspect
import sys
sys.stdout.write(str(inspect.signature(create_react_agent)))
