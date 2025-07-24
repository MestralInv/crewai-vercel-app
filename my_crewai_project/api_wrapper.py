#!/usr/bin/env python3
"""
API Wrapper for CrewAI System
This can be deployed as a separate microservice or used with Vercel Python functions
"""

import json
import sys
import os
from typing import Dict, Any
from crewai import Agent, Task, Crew, LLM
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def create_agents() -> tuple[Agent, Agent, Agent]:
    """Create and return the three agents"""
    model_name = os.getenv("GROQ_MODEL_NAME", "llama3-70b-8192")
    llm = LLM(model=f"groq/{model_name}")

    planner = Agent(
        role="Content Planner",
        goal="Plan engaging and factually accurate content on {topic}",
        backstory="You're working on planning a blog a memo for a big investment firm management team"
                  "about the topic: {topic}."
                  "You collect information that helps the "
                  "audience learn something "
                  "and make informed decisions. "
                  "Your work is the basis for "
                  "the Content Writer to write an article on this topic.",
        llm=llm,
        allow_delegation=False,
        verbose=False  # Disable verbose for API usage
    )

    writer = Agent(
        role="Content Writer",
        goal="Write insightful and factually accurate "
             "memo piece about the topic: {topic}",
        backstory="You're working on a writing "
                  "a new opinion piece about the topic: {topic}. "
                  "You base your writing on the work of "
                  "the Content Planner, who provides an outline "
                  "and relevant context about the topic. "
                  "You follow the main objectives and "
                  "direction of the outline, "
                  "as provide by the Content Planner. "
                  "You also provide objective and impartial insights "
                  "and back them up with information "
                  "provide by the Content Planner. "
                  "You acknowledge in your opinion piece "
                  "when your statements are opinions "
                  "as opposed to objective statements.",
        llm=llm,
        allow_delegation=False,
        verbose=False
    )

    editor = Agent(
        role="Editor",
        goal="Edit a given memo align with "
             "the writing style of the organization. ",
        backstory="You are an editor who receives a technical memo"
                  "from the Content Writer. "
                  "Your goal is to review the memo "
                  "to ensure that it follows best practices in writing,"
                  "provides balanced viewpoints "
                  "when providing opinions or assertions, "
                  "and also avoids major controversial topics "
                  "or opinions when possible.",
        llm=llm,
        allow_delegation=False,
        verbose=False
    )

    return planner, writer, editor

def create_tasks(planner: Agent, writer: Agent, editor: Agent) -> tuple[Task, Task, Task]:
    """Create and return the three tasks"""
    plan = Task(
        description=
            "1. Prioritize the latest trends, key players, "
                "and noteworthy news on {topic}.\n"
            "2. Identify the target audience, considering "
                "their interests and pain points.\n"
            "3. Develop a detailed content outline including "
                "an introduction, key points, and a call to action.\n"
            "4. Include relevant data or sources.",
        expected_output="A comprehensive content plan document "
            "with an outline, audience analysis, "
            "and resources.",
        agent=planner
    )

    write = Task(
        description=
            "1. Use the content plan to craft a compelling "
                "memo on {topic}.\n"
            "2. Incorporate technical wording with pedagogical language.\n"
            "3. Sections/Subtitles are properly named "
                "in an engaging manner.\n"
            "4. Ensure the post is structured with an "
                "engaging introduction, insightful body, "
                "and a summarizing conclusion.\n"
            "5. Proofread for grammatical errors and "
                "alignment with the brand's voice.\n",
        expected_output="A well-written memo "
            "in markdown format, ready for publication, "
            "each section should have 2 or 3 paragraphs.",
        agent=writer
    )

    edit = Task(
        description=
            "Proofread the given blog post for "
                     "grammatical errors and "
                     "alignment with the brand's voice.",
        expected_output="A well-written memo in markdown format, "
                        "ready for publication, "
                        "each section should have 2 or 3 paragraphs.",
        agent=editor
    )

    return plan, write, edit

def run_crew(topic: str) -> Dict[str, Any]:
    """Run the CrewAI workflow with the given topic"""
    try:
        # Create agents and tasks
        planner, writer, editor = create_agents()
        plan_task, write_task, edit_task = create_tasks(planner, writer, editor)
        
        # Create and run the crew
        crew = Crew(
            agents=[planner, writer, editor], 
            tasks=[plan_task, write_task, edit_task], 
            verbose=False
        )
        
        result = crew.kickoff(inputs={"topic": topic})
        
        return {
            "success": True,
            "result": str(result),
            "topic": topic
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "topic": topic
        }

def main():
    """Main function for CLI usage"""
    if len(sys.argv) < 2:
        topic = "AI implementation in the investment industry"
    else:
        topic = " ".join(sys.argv[1:])
    
    result = run_crew(topic)
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main() 