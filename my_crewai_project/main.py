from crewai import Agent, Task, Crew, LLM
from dotenv import load_dotenv
import os

load_dotenv()  # Load environment variables

# Initialize Groq LLM using GROQ_MODEL_NAME from .env
model_name = os.getenv("GROQ_MODEL_NAME", "llama3-70b-8192")  # Fallback to a supported model
llm = LLM(model=f"groq/{model_name}")

# Define an agent
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
    verbose=True
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
    verbose=True
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
    verbose=True
)

# Define a task with expected_output
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

edite = Task(
    description=
        "Proofread the given blog post for "
                 "grammatical errors and "
                 "alignment with the brand's voice.",
    expected_output="A well-written memo in markdown format, "
                    "ready for publication, "
                    "each section should have 2 or 3 paragraphs.",
    agent=editor
)



# Create and run the crew
crew = Crew(agents=[planner,writer,editor], tasks=[plan,write,edite], verbose=True)
result = crew.kickoff(inputs={"topic": "AI implementation in the investment industry"})
print(result)