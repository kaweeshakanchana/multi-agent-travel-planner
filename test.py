import traceback

try:
    import app.agents.requirements_agent
except Exception as e:
    with open("err.log", "w", encoding="utf-8") as f:
        f.write(traceback.format_exc())
