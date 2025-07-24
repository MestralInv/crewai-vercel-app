#!/usr/bin/env python3
"""
Simplified CrewAI for Vercel deployment (prototype version)
Optimized to run within 10-60 second timeout limits
"""

import json
import sys
import os
from typing import Dict, Any
from crewai import Agent, Task, Crew, LLM
from dotenv import load_dotenv

load_dotenv()

def create_simple_crew() -> tuple[Agent, Task]:
    """Create a simplified single-agent crew for faster execution"""
    model_name = os.getenv("GROQ_MODEL_NAME", "llama3-8b-8192")  # Use faster 8B model
    llm = LLM(model=f"groq/{model_name}")

    # Single agent instead of three
    writer = Agent(
        role="Content Analyst",
        goal="Create a brief analysis on {topic}",
        backstory="You're a content analyst who creates concise, "
                  "insightful summaries on business topics. "
                  "You focus on key points and actionable insights.",
        llm=llm,
        allow_delegation=False,
        verbose=False
    )

    # Single, simpler task
    task = Task(
        description="Create a brief 2-paragraph analysis on {topic}. "
                   "Include key insights and one actionable recommendation.",
        expected_output="A concise 2-paragraph analysis with actionable insights.",
        agent=writer
    )

    return writer, task

def run_simple_crew(topic: str) -> Dict[str, Any]:
    """Run simplified CrewAI workflow optimized for speed"""
    try:
        # Create simplified crew
        agent, task = create_simple_crew()
        
        # Create crew with single agent and task
        crew = Crew(
            agents=[agent], 
            tasks=[task], 
            verbose=False
        )
        
        # Run with timeout consideration
        result = crew.kickoff(inputs={"topic": topic})
        
        return {
            "success": True,
            "result": str(result),
            "topic": topic,
            "type": "simplified_prototype"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "topic": topic,
            "type": "simplified_prototype"
        }

def main():
    """CLI interface"""
    if len(sys.argv) < 2:
        topic = "AI implementation in the investment industry"
    else:
        topic = " ".join(sys.argv[1:])
    
    result = run_simple_crew(topic)
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main() 