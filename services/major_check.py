from fastapi import FastAPI, Query
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()

# Load a specialized model for academic/technical terms
model = SentenceTransformer('allenai-specter')  # Optimized for scientific fields

def preprocess_major(major):
    """Standardize majors for consistent embeddings."""
    major = major.lower().strip()
    major = major.replace("-", " ").replace("_", " ")  # Handle hyphens/underscores
    return major

def compare_majors(job_major, candidate_major):
    # Preprocess majors
    job_major = preprocess_major(job_major)
    candidate_major = preprocess_major(candidate_major)
    
    # Generate embeddings
    embeddings = model.encode([job_major, candidate_major])
    
    # Calculate cosine similarity
    similarity = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
    return similarity

@app.get("/compare")
def compare(job_major: str, candidate_major: str):
    similarity_score = compare_majors(job_major, candidate_major)
    return {"similarity": round(float(similarity_score), 3)}


# uvicorn major_check:app --reload
# http://127.0.0.1:8000/compare?job_major=Computer%20Science&candidate_major=Software%20Engineering
# limitation majors should be entered in full form not like cs , ai it should be computer science , artificial intelligence or software engineering 
