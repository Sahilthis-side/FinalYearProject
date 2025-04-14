from fastapi import FastAPI, Query
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import random
from difflib import SequenceMatcher
from fuzzywuzzy import fuzz, process

app = FastAPI()

# Load a specialized model for academic/technical terms
model = SentenceTransformer('allenai-specter')  # Optimized for scientific fields

# Common variations and abbreviations of majors for better matching
major_aliases = {
    "cs": "computer science",
    "cse": "computer science engineering",
    "it": "information technology",
    "is": "information systems",
    "se": "software engineering",
    "ai": "artificial intelligence",
    "ml": "machine learning",
    "ce": "computer engineering",
    "ee": "electrical engineering",
    "me": "mechanical engineering",
    "eee": "electrical and electronics engineering",
    "ece": "electronics and communication engineering",
    "civil": "civil engineering",
    "chem eng": "chemical engineering",
    "bio tech": "biotechnology",
    "physics": "physics",
    "chem": "chemistry",
    "biochem": "biochemistry",
    "bio": "biology",
    "math": "mathematics",
    "stats": "statistics",
    "econ": "economics",
    "psych": "psychology",
    "socio": "sociology",
    "polsci": "political science",
    "lit": "literature",
    "eng lit": "english literature",
    "phil": "philosophy",
    "hist": "history",
    "geo": "geography",
    "anthro": "anthropology",
    "bba": "business administration",
    "mba": "master of business administration",
    "fin": "finance",
    "acct": "accounting",
    "mktg": "marketing",
    "hr": "human resources"
}

def preprocess_major(major):
    """Standardize majors for consistent embeddings."""
    major = major.lower().strip()
    major = major.replace("-", " ").replace("_", " ")  # Handle hyphens/underscores
    
    # Check if it's a known abbreviation/alias and replace with full form
    if major in major_aliases:
        return major_aliases[major]
    
    return major

def get_string_similarity(str1, str2):
    """Calculate string-based similarity for handling slight spelling variations."""
    return SequenceMatcher(None, str1.lower(), str2.lower()).ratio()

def get_fuzzy_similarity(str1, str2):
    """Get fuzzy match score using multiple algorithms and return the best match."""
    # Different fuzzy matching algorithms for different types of variations
    ratio = fuzz.ratio(str1.lower(), str2.lower())
    partial_ratio = fuzz.partial_ratio(str1.lower(), str2.lower())
    token_sort_ratio = fuzz.token_sort_ratio(str1.lower(), str2.lower())
    token_set_ratio = fuzz.token_set_ratio(str1.lower(), str2.lower())
    
    # Return the highest matching score
    return max(ratio, partial_ratio, token_sort_ratio, token_set_ratio) / 100.0

def compare_majors(job_major, candidate_major):
    """Compare majors using multiple similarity methods and return the best score."""
    # Prepare original and preprocessed versions
    job_major_original = job_major
    candidate_major_original = candidate_major
    
    job_major_processed = preprocess_major(job_major)
    candidate_major_processed = preprocess_major(candidate_major)
    
    # Check basic string similarity (for typos and small variations)
    string_sim = get_string_similarity(job_major_original, candidate_major_original)
    
    # Check fuzzy matching (better for word order, plural forms, etc.)
    fuzzy_sim_original = get_fuzzy_similarity(job_major_original, candidate_major_original)
    fuzzy_sim_processed = get_fuzzy_similarity(job_major_processed, candidate_major_processed)
    
    # If direct fuzzy match is very high (likely same major with variations)
    if fuzzy_sim_original > 0.9 or fuzzy_sim_processed > 0.9:
        return max(fuzzy_sim_original, fuzzy_sim_processed)
    
    # For aliases that might map to the same major
    if job_major_processed == candidate_major_processed:
        return 1.0
    
    # If strings are very similar (likely just case/spelling differences), give high score
    if string_sim > 0.85:
        return max(string_sim, 0.9)  # Ensure high similarity for near-matches
    
    # Use semantic meaning for less obvious matches
    # Generate embeddings
    embeddings = model.encode([job_major_processed, candidate_major_processed])
    
    # Calculate cosine similarity
    semantic_sim = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
    
    # Return the best similarity score from all methods
    return max(string_sim, fuzzy_sim_original, fuzzy_sim_processed, semantic_sim)

def identify_relationship(job_major, candidate_major):
    """Identify the relationship between majors for the report."""
    job_processed = preprocess_major(job_major)
    candidate_processed = preprocess_major(candidate_major)
    
    # Check if they're exact matches after preprocessing
    if job_processed == candidate_processed:
        return "equivalent majors"
    
    # Calculate overall similarity (same logic as compare_majors)
    string_sim = get_string_similarity(job_major, candidate_processed)
    fuzzy_sim = get_fuzzy_similarity(job_processed, candidate_processed)
    fuzzy_sim_orig = get_fuzzy_similarity(job_major, candidate_major)
    
    # Generate embeddings for semantic similarity
    embeddings = model.encode([job_processed, candidate_processed])
    semantic_sim = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
    
    # Get best overall similarity score
    overall_sim = max(string_sim, fuzzy_sim, fuzzy_sim_orig, semantic_sim)
    
    # Use overall similarity for relationship classification
    if overall_sim > 0.90:
        return "close variations of the same field"
    elif overall_sim > 0.80:
        return "closely related fields"
    elif overall_sim > 0.60:
        return "somewhat related fields"
    else:
        return "different fields"

def generate_major_report(job_major, candidate_major, similarity_score):
    """Generate a dynamic report on the similarity between majors."""
    # Round similarity score to percentage
    percentage = round(similarity_score * 100)
    
    # Get the relationship description based on the actual similarity score
    relationship = identify_relationship(job_major, candidate_major)
    
    # Debugging context for developing better relationship detection
    debug_info = ""
    # debug_info = f" [DEBUG: similarity={similarity_score}, relationship={relationship}]"
    
    # Prepare intro statements with variations
    intros = [
        f"The comparison between the job requirement major '{job_major}' and candidate's major '{candidate_major}' shows a similarity score of {percentage}%.",
        f"Analysis of the candidate's major '{candidate_major}' against the required major '{job_major}' yields a {percentage}% match.",
        f"The candidate's major '{candidate_major}' has a {percentage}% similarity with the job's required major '{job_major}'."
    ]
    
    # Add relationship context
    relationship_context = f" These appear to be {relationship}."
    
    # Select interpretation based on similarity score
    if similarity_score >= 0.9:
        interpretations = [
            f"This indicates an excellent match between the majors.{relationship_context} The candidate's educational background aligns very well with the job requirements.",
            f"The majors are highly compatible.{relationship_context} The candidate likely possesses the core knowledge and skills required for the position.",
            f"This represents a strong alignment between the candidate's education and the job's field requirements.{relationship_context}"
        ]
    elif similarity_score >= 0.75:
        interpretations = [
            f"This shows a good match between the majors.{relationship_context} The candidate has significant relevant educational background for the position.",
            f"The majors are well-aligned.{relationship_context} The candidate likely has most of the subject knowledge needed for the role.",
            f"This indicates substantial overlap between the candidate's educational focus and the job requirements.{relationship_context}"
        ]
    elif similarity_score >= 0.6:
        interpretations = [
            f"This indicates a moderate match.{relationship_context} The candidate has some relevant educational background, but may need additional training in certain areas.",
            f"The majors show partial alignment.{relationship_context} The candidate may have foundational knowledge but might lack some specialized training required for the position.",
            f"This represents a fair degree of overlap between the disciplines.{relationship_context} Some knowledge gaps may exist but could be addressed through targeted professional development."
        ]
    elif similarity_score >= 0.4:
        interpretations = [
            f"This shows a limited match.{relationship_context} The candidate's educational background has some transferable elements but significant differences exist.",
            f"The majors have minimal alignment.{relationship_context} The candidate may need substantial additional training to meet the educational requirements of the position.",
            f"This represents a modest overlap between the fields.{relationship_context} Consider whether the candidate has supplementary experience that might compensate for the educational differences."
        ]
    else:
        interpretations = [
            f"This indicates a weak match.{relationship_context} The candidate's educational background differs significantly from the job requirements.",
            f"The majors show little alignment.{relationship_context} Consider whether the position genuinely requires the specific educational background or if equivalent experience might suffice.",
            f"This represents minimal overlap between the disciplines.{relationship_context} Evaluate if the candidate has compensating professional experience or supplementary education."
        ]
    
    # Randomly select intro and interpretation for variety
    report = f"{random.choice(intros)} {random.choice(interpretations)}"
    return report

@app.get("/compare")
def compare(job_major: str, candidate_major: str):
    similarity_score = compare_majors(job_major, candidate_major)
    report = generate_major_report(job_major, candidate_major, similarity_score)
    
    # Return normalized versions for reference
    job_major_normalized = preprocess_major(job_major)
    candidate_major_normalized = preprocess_major(candidate_major)
    
    return {
        "similarity": round(float(similarity_score), 3)*100,
        "job_major": job_major,
        "candidate_major": candidate_major,
        "job_major_normalized": job_major_normalized,
        "candidate_major_normalized": candidate_major_normalized,
        "report": report
    }


# uvicorn dc1:app --reload
# http://127.0.0.1:8000/compare?job_major=Computer%20Science&candidate_major=Software%20Engineering
