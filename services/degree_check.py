from fastapi import FastAPI
from sentence_transformers import SentenceTransformer, util
import requests
import math
import random

app = FastAPI()

# Load SBERT model
model = SentenceTransformer("all-mpnet-base-v2")

# Predefined degree rankings (local hierarchy)
degree_rank = {
    "PhD": 6,
    "MTech": 5, "MS": 5, "MSc": 5, "MCA": 3.5,
    "BTech": 3, "BE": 3, "BSc": 2, "BCA": 1, "Diploma": 0.5
}

# Synonyms for normalization
degree_synonyms = {
    "B.E.": "BE",
    "B.Sc.": "BSc",
    "M.Sc.": "MSc",
    "Master of Science": "MSc",
    "Bachelor of Technology": "BTech",
}

def normalize_degree(degree):
    """Normalize degree by removing dots, spaces, and handling synonyms."""
    degree = degree.replace(".", "").strip().lower()  # Convert to lowercase for consistency
    return degree_synonyms.get(degree, degree).lower()

def fetch_global_rank(degree):
    """Fetch degree hierarchy from Wikidata using SPARQL."""
    query = f"""
    SELECT ?degreeLabel ?parentLabel WHERE {{
      ?degree wdt:P31 wd:Q189533;  # Instance of academic degree
              rdfs:label "{degree}"@en.
      OPTIONAL {{ ?degree wdt:P279 ?parent. }}
      SERVICE wikibase:label {{ bd:serviceParam wikibase:language "en". }}
    }}
    """
    url = "https://query.wikidata.org/sparql"
    headers = {"Accept": "application/json"}
    response = requests.get(url, headers=headers, params={"query": query})

    if response.status_code == 200:
        data = response.json()
        results = data.get("results", {}).get("bindings", [])
        
        parent_degrees = [entry["parentLabel"]["value"] for entry in results if "parentLabel" in entry]
        
        if parent_degrees:
            for parent in parent_degrees:
                if parent in degree_rank:
                    return degree_rank[parent]  # Assign parent's rank
    
    return None  # No known hierarchy

def get_degree_score(degree):
    """Returns predefined weight if known, else finds closest match."""
    degree = normalize_degree(degree)
    
    if degree in degree_rank:
        return degree_rank[degree]
    
    # Try fetching global equivalence
    global_rank = fetch_global_rank(degree)
    if global_rank is not None:
        return global_rank

    # Compute similarity with known degrees
    known_degrees = list(degree_rank.keys())
    emb_degree = model.encode(degree, convert_to_tensor=True)
    similarities = {d: util.pytorch_cos_sim(emb_degree, model.encode(d, convert_to_tensor=True)).item() for d in known_degrees}
    
    # Find best matching known degree
    best_match = max(similarities, key=similarities.get)
    
    # Adjust score based on similarity percentage
    return degree_rank[best_match] * similarities[best_match]

def degree_similarity(candidate_degree, job_requirement):
    """Computes similarity score between candidate and job degree."""
    candidate_score = get_degree_score(candidate_degree)
    job_score = get_degree_score(job_requirement)

    if job_score == 0:  # Avoid division by zero
        return 0

    degree_gap = abs(candidate_score - job_score)

    # Candidate has a lower degree → Apply a penalty
    if candidate_score < job_score:
        penalty = max(40, 100 - (degree_gap * 10))  # Min 40
        return round(penalty, 2)

    # Candidate has a higher degree → Apply a bonus
    if candidate_score > job_score:
        bonus = min(140, 100 + (degree_gap * 10))  # Max 140
        return round(bonus, 2)

    return 100  # Exact match

def generate_report(candidate_degree, job_requirement, similarity_score):
    """Generates a dynamic report about how well the candidate's degree matches the job requirement."""
    messages = []
    
    # Add context about the degrees and score
    degree_difference = ""
    if similarity_score == 100:
        degree_difference = "exact match"
    elif similarity_score > 100:
        degree_difference = "higher than required"
    elif similarity_score < 100:
        degree_difference = "lower than required"
    
    # Report variations to avoid static responses
    report_variations = [
        f"The candidate with a {candidate_degree} degree applying for a position requiring {job_requirement} shows a match score of {similarity_score}%. This represents a {degree_difference} qualification scenario.",
        
        f"With a similarity score of {similarity_score}%, the candidate's {candidate_degree} degree compared to the job's {job_requirement} requirement indicates a {degree_difference} in educational qualifications.",
        
        f"Analysis shows a {similarity_score}% match between the candidate's {candidate_degree} degree and the position's {job_requirement} requirement, representing a {degree_difference} qualification level."
    ]
    
    # Select a random base variation
    base_report = random.choice(report_variations)
    
    # Add detailed analysis based on score ranges
    if similarity_score >= 130:
        detail = random.choice([
            f"The candidate is significantly overqualified with their {candidate_degree}, which substantially exceeds the {job_requirement} requirement. This could indicate excellent academic credentials but may raise concerns about retention if the role doesn't offer sufficient challenges.",
            f"With a {candidate_degree} that far exceeds the required {job_requirement}, the candidate brings exceptional educational qualifications that might benefit complex aspects of the role, though position fit should be carefully evaluated.",
        ])
    elif 110 <= similarity_score < 130:
        detail = random.choice([
            f"The candidate's {candidate_degree} moderately exceeds the required {job_requirement}, suggesting they bring additional educational background that could be beneficial for the role.",
            f"With qualifications above the required {job_requirement}, the candidate's {candidate_degree} indicates they may bring additional academic perspective to the position.",
        ])
    elif 95 <= similarity_score < 110:
        detail = random.choice([
            f"The candidate's {candidate_degree} aligns well with the {job_requirement} requirement, suggesting an appropriate educational background for the position.",
            f"There is a strong educational match between the candidate's {candidate_degree} and the position's {job_requirement} requirement, indicating suitable academic preparation.",
        ])
    elif 80 <= similarity_score < 95:
        detail = random.choice([
            f"The candidate's {candidate_degree} is slightly below the ideal {job_requirement} qualification, but may be sufficient depending on other factors such as relevant experience.",
            f"While the {candidate_degree} is somewhat below the preferred {job_requirement}, the candidate might compensate through practical experience or specific skills relevant to the role.",
        ])
    elif 60 <= similarity_score < 80:
        detail = random.choice([
            f"The {candidate_degree} falls notably below the {job_requirement} requirement, indicating a potential gap in educational background that would need to be offset by significant relevant experience.",
            f"There is a considerable difference between the candidate's {candidate_degree} and the required {job_requirement}, which may affect their preparedness for certain aspects of the role.",
        ])
    else:
        detail = random.choice([
            f"The candidate's {candidate_degree} qualification shows a substantial misalignment with the required {job_requirement}, suggesting this may not be an appropriate match purely from an educational perspective.",
            f"With a significant gap between the {candidate_degree} and the required {job_requirement}, the candidate would need extraordinary compensating qualifications to be considered suitable.",
        ])
    
    # Combine the base report and detailed analysis
    complete_report = f"{base_report} {detail}"
    
    return complete_report

@app.get("/degree_similarity/")
def degree_similarity_api(candidate_degree: str, job_requirement: str):
    """API endpoint to compare degrees."""
    similarity_score = degree_similarity(candidate_degree, job_requirement)
    report = generate_report(candidate_degree, job_requirement, similarity_score)
    return {
        "degree_similarity_score": similarity_score,
        "candidate_degree": candidate_degree,
        "job_requirement": job_requirement,
        "report": report
    }
