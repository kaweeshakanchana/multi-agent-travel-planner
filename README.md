# 🌍 AI-Powered Multi-Agent Travel Planner

![Travel Planner Banner](https://img.shields.io/badge/AI-Multi--Agent_Architecture-blue)
![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel)

A fully automated, intelligent system that handles the entire travel planning process—from gathering user preferences and researching optimal flights and hotels, to generating a day-by-day itinerary and simulating the booking process.

Instead of a single chatbot, this application utilizes a **Multi-Agent Architecture** powered by **LangGraph**, where specialized AI agents collaborate behind the scenes to orchestrate complex reasoning workflows.

## 🚀 Live Demo

**Try it out here:** [https://multi-agent-travel-planner-murex.vercel.app](https://multi-agent-travel-planner-murex.vercel.app)

---

## ✨ Features

- **Multi-Agent Orchestration:** Specialized AI agents handle distinct parts of the travel process:
  - 📝 **Gathering Agent:** Extracts destination, dates, budget, and traveler details from natural language.
  - 🔍 **Research Agent:** Performs real-time web searches (via DuckDuckGo) to find actual flight options, hotels, and local activities based on gathered requirements.
  - 📅 **Planning Agent:** Synthesizes research data to construct a comprehensive, logically ordered day-by-day itinerary.
  - 🎟️ **Booking Agent:** Verifies the final plan and generates simulated booking confirmations.
- **Modern Interface:** A clean, responsive React frontend utilizing a glassmorphic design system to separate chat interactions from a dynamic JSON data visualizer.
- **Serverless Deployment:** Fully deployed and optimized for Vercel using Python Serverless Functions.

## 🛠️ Technology Stack

- **AI & Orchestration:** `LangGraph`, `LangChain`, `Google Gemini 2.5 Flash`
- **Backend:** `Python`, `FastAPI`
- **Frontend:** `React` (Vite), Vanilla CSS
- **Tools:** `DuckDuckGo Search API`
- **Deployment:** `Vercel`

## ⚙️ Local Development

### Prerequisites

- Python 3.11+
- Node.js 18+
- A Google Gemini API Key

### Backend Setup

1. Clone the repository
2. Install dependencies using `uv` or `pip`:
   ```bash
   uv pip install -r requirements.txt
   ```
3. Create a `.env` file in the root directory and add your API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   GEMINI_MODEL_NAME=gemini-2.5-flash
   ```
4. Start the FastAPI server:
   ```bash
   uv run python app/main.py
   ```
   The backend will run on `http://127.0.0.1:8000`.

### Frontend Setup (React)

1. Navigate to the frontend source directory:
   ```bash
   cd react-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   _Note: To build the frontend for production and serve it via FastAPI, run `npm run build` which will output to the `/frontend` directory._
