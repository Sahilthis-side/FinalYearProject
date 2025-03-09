import pandas as pd
import random
from fastapi import FastAPI

# Defining the FastAPI application
app = FastAPI()

# Loading the dataset
file_path = "QuestionDataset.xlsx"
df = pd.read_excel(file_path, engine="openpyxl")

@app.get("/generate_questionnaire/")
def generate_questionnaire(job_role: str):
    """
    Generates a questionnaire with 20 questions based on the selected job role.
    :param job_role: The job role selected by the candidate.
    :return: List of 20 MCQs in JSON format.
    """
    # Filtering questions for the selected job role
    filtered_df = df[df["Job Role"].str.lower() == job_role.lower()]
    
    if filtered_df.empty:
        return {"error": "No questions found for the given job role."}
    
    # Randomly selecting 20 questions from the filtered dataset
    selected_questions = filtered_df.sample(n=20, random_state=random.randint(1, 1000)).to_dict(orient="records")

    return {"questions": selected_questions}

# To run the API, use: uvicorn questionnaire_model:app --reload
# Call the API using a browser: http://127.0.0.1:8000/generate_questionnaire/?job_role=frontend developer
# In the above link for job_role write the job role for which you need to get the questions
