import spacy
import re
import os
import json
import requests
import numpy as np
from collections import Counter
from typing import List, Dict, Set
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer, util
from sklearn.metrics.pairwise import cosine_similarity
from fuzzywuzzy import fuzz

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_md")  # Medium-sized model with word vectors
except:
    print("Installing spaCy model...")
    import os
    os.system("python -m spacy download en_core_web_md")
    nlp = spacy.load("en_core_web_md")

# Create FastAPI app
app = FastAPI(
    title="Resume Matching API",
    description="API for matching job requirements with candidate qualifications"
)

# Load models
major_model = SentenceTransformer('allenai-specter')  # For major comparison
degree_model = SentenceTransformer("all-mpnet-base-v2")  # For degree comparison
skills_model = SentenceTransformer('paraphrase-MiniLM-L6-v2')  # For skills comparison

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

# Knowledge base of broader skill categories and their related skills
skill_categories = {
    "web development": [
        "html", "css", "javascript", "js", "typescript", "react", "angular", 
        "vue", "jquery", "bootstrap", "sass", "less", "webpack", "frontend", 
        "backend", "fullstack", "responsive design", "spa", "pwa", "web design",
        "dom", "ajax", "restful api", "node.js", "express.js", "nextjs"
    ],
    "ai": [
        "artificial intelligence", "machine learning", "deep learning", "neural networks",
        "nlp", "natural language processing", "computer vision", "reinforcement learning",
        "tensorflow", "pytorch", "keras", "scikit-learn", "transformers", "llm"
    ],
    "data science": [
        "data analysis", "big data", "data mining", "data visualization", "statistics",
        "python", "r", "pandas", "numpy", "scipy", "matplotlib", "tableau", "power bi",
        "sql", "database", "etl", "data warehouse", "predictive modeling", "regression",
        "classification", "clustering", "time series", "hypothesis testing"
    ],
    # ... (other skill categories from esco-skills-matching.py)
}

# Common skill synonyms and related terms
skill_relationships = {
    "python": ["python programming", "py", "python3", "coding", "programming"],
    "machine learning": ["ml", "deep learning", "neural networks", "ai", "artificial intelligence", 
                       "predictive modeling", "predictive analytics", "neural network", "clustering",
                       "classification", "regression", "computer vision", "nlp", "natural language processing"],
    "data analysis": ["data analytics", "data mining", "statistical analysis", "data science", 
                    "data visualization", "data processing", "analytics", "statistics", "forecasting"],
    "sql": ["database", "mysql", "postgresql", "postgres", "sqlite", "nosql", "relational database"],
    "tensorflow": ["tf", "keras", "deep learning framework"],
    "javascript": ["js", "ecmascript", "node.js", "nodejs"],
    "react": ["reactjs", "react.js"],
    "java": ["j2ee", "spring", "hibernate"],
    "c#": ["csharp", ".net", "dotnet"],
    "docker": ["containerization", "kubernetes", "k8s"],
}

# Define request models
class Project(BaseModel):
    name: str
    description: str
    skills: List[str]

class CandidateProfile(BaseModel):
    degree: str
    major: str
    skills: List[str]
    projects: List[Project]

class JobRequirements(BaseModel):
    degree: str
    major: str
    skills: List[str]

class MatchRequest(BaseModel):
    job: JobRequirements
    candidate: CandidateProfile

# Functions from dc1.py (major comparison)
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
    embeddings = major_model.encode([job_major, candidate_major])
    
    # Calculate cosine similarity
    similarity = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
    return similarity

# Functions from degree_check.py
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
    emb_degree = degree_model.encode(degree, convert_to_tensor=True)
    similarities = {d: util.pytorch_cos_sim(emb_degree, degree_model.encode(d, convert_to_tensor=True)).item() for d in known_degrees}
    
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

# Functions from proj_check.py
def detect_domain(skills_list):
    """Detect the domain of skills or project title"""
    # Convert to lowercase strings
    skills_text = " ".join(skills_list).lower()
    
    # Define domain detection rules
    domains = {
        "machine learning": ["machine learning", "ml", "deep learning", "neural network", "ai", "artificial intelligence",
                           "model", "predictive", "classification", "clustering", "tensorflow", "keras"],
        "web development": ["web", "javascript", "html", "css", "react", "angular", "vue", "frontend", "backend",
                          "fullstack", "node", "express"],
        "data science": ["data science", "data analysis", "analytics", "visualization", "statistics", 
                        "dashboard", "bi", "business intelligence"],
        "devops": ["devops", "docker", "kubernetes", "k8s", "ci/cd", "pipeline", "jenkins", "aws", "cloud"],
        "mobile": ["mobile", "android", "ios", "swift", "flutter", "react native", "app"]
    }
    
    # Score each domain
    domain_scores = {}
    for domain, keywords in domains.items():
        score = sum(1 for keyword in keywords if keyword in skills_text)
        domain_scores[domain] = score
    
    # Return the domain with the highest score, if any
    max_domain = max(domain_scores.items(), key=lambda x: x[1])
    return max_domain[0] if max_domain[1] > 0 else None

def calculate_job_match(job_requirements, projects):
    """
    Calculate how well a candidate's projects match job requirements.
    
    Args:
        job_requirements: list of skills required for the job
        projects: list of dictionaries containing project information
            Each project has 'name', 'description', and 'skills' keys
            
    Returns:
        overall_match_percentage: float representing the overall match percentage
        consolidated_report: dictionary with consolidated match information
    """
    # Normalize all skills (lowercase for case-insensitive comparison)
    job_requirements = [skill.lower().strip() for skill in job_requirements]
    
    # Create spaCy docs for job requirements for semantic matching
    job_req_docs = [nlp(req) for req in job_requirements]
    
    # Check for domain alignment - detect if the projects are in the same domain as the job
    job_domain = detect_domain(job_requirements)
    
    # Track match details for each project
    project_scores = []
    project_matches = []
    
    # Track skills across all projects
    all_demonstrated_skills = set()
    skill_demonstrated_in = {req: [] for req in job_requirements}
    skill_match_types = {req: set() for req in job_requirements}
    
    # Analyze each project
    for project in projects:
        project_skills = [skill.lower().strip() for skill in project['skills']]
        project_domain = detect_domain(project_skills + [project['name'].lower()])
        
        # 1. Direct skill matches
        direct_matches = set()
        for skill in project_skills:
            if skill in job_requirements:
                direct_matches.add(skill)
                skill_demonstrated_in[skill].append(project['name'])
                skill_match_types[skill].add("direct")
        
        # 2. Synonym matching using the knowledge base
        synonym_matches = set()
        for skill in project_skills:
            for req in job_requirements:
                # Check if skill is a synonym of a required skill
                if req in skill_relationships and skill in skill_relationships[req]:
                    synonym_matches.add(req)
                    skill_demonstrated_in[req].append(project['name'])
                    skill_match_types[req].add("synonym")
                # Check if required skill is a synonym of the candidate's skill
                elif skill in skill_relationships and req in skill_relationships[skill]:
                    synonym_matches.add(req)
                    skill_demonstrated_in[req].append(project['name'])
                    skill_match_types[req].add("synonym")
        
        # 3. Semantic similarity matching using spaCy word vectors
        semantic_matches = set()
        for skill_doc in [nlp(skill) for skill in project_skills]:
            for i, req_doc in enumerate(job_req_docs):
                # If similarity is above threshold, consider it a match
                if skill_doc.vector_norm and req_doc.vector_norm:  # Check if vectors exist
                    similarity = skill_doc.similarity(req_doc)
                    # Lower the threshold from 0.75 to 0.6 for more matches
                    if similarity > 0.6 and job_requirements[i] not in direct_matches and job_requirements[i] not in synonym_matches:
                        semantic_matches.add(job_requirements[i])
                        skill_demonstrated_in[job_requirements[i]].append(project['name'])
                        skill_match_types[job_requirements[i]].add("semantic")
        
        # Combine all matched skills for this project
        project_matching_skills = direct_matches.union(synonym_matches).union(semantic_matches)
        all_demonstrated_skills.update(project_matching_skills)
        
        # Calculate raw match percentage
        raw_match_percentage = (len(project_matching_skills) / len(job_requirements)) * 100 if job_requirements else 0
        
        # Apply domain alignment bonus (if project domain matches job domain)
        domain_bonus = 0
        domain_match = False
        if job_domain and project_domain and job_domain == project_domain:
            domain_match = True
            domain_bonus = min(20, 100 - raw_match_percentage)  # Up to 20% bonus, not exceeding 100%
        
        # Calculate final match percentage
        match_percentage = min(100, raw_match_percentage + domain_bonus)
        
        # Store project match information
        project_match = {
            'name': project['name'],
            'match_percentage': round(match_percentage, 2),
            'raw_percentage': round(raw_match_percentage, 2),
            'domain_match': domain_match,
            'domain_bonus': round(domain_bonus, 2),
            'matching_skills': list(project_matching_skills),
            'missing_skills': [skill for skill in job_requirements if skill not in project_matching_skills]
        }
        project_matches.append(project_match)
        project_scores.append(match_percentage)
    
    # Calculate overall match percentage using a weighted approach that favors best matches
    if project_scores:
        # 60% weight to the best project, 40% to the average of all projects
        best_match = max(project_scores)
        avg_match = sum(project_scores) / len(project_scores)
        overall_match_percentage = (0.6 * best_match) + (0.4 * avg_match)
    else:
        overall_match_percentage = 0
    
    # Create a consolidated skills report
    skills_report = []
    for req in job_requirements:
        if req in all_demonstrated_skills:
            match_type = ", ".join(skill_match_types[req])
            projects_with_skill = skill_demonstrated_in[req]
            skills_report.append({
                'skill': req,
                'demonstrated': True,
                'match_type': match_type,
                'projects': projects_with_skill
            })
        else:
            skills_report.append({
                'skill': req,
                'demonstrated': False,
                'match_type': "not found",
                'projects': []
            })
    
    # Create a consolidated report
    consolidated_report = {
        'overall_match': round(overall_match_percentage, 2),
        'skills_assessment': skills_report,
        'project_matches': sorted(project_matches, key=lambda x: x['match_percentage'], reverse=True),
        'missing_skills': [req for req in job_requirements if req not in all_demonstrated_skills],
        'job_domain': job_domain
    }
    
    return round(overall_match_percentage, 2), consolidated_report

# Functions from esco-skills-matching.py
def calculate_skills_similarity(job_skills, candidate_skills):
    """
    Calculate similarity between job skills and candidate skills.
    
    Args:
        job_skills: List of skills required for the job
        candidate_skills: List of skills possessed by the candidate
        
    Returns:
        Dictionary with matching results and scores
    """
    # Enrich skills with knowledge base
    enriched_job_skills = {}
    enriched_candidate_skills = {}
    
    for skill in job_skills:
        skill_lower = skill.lower()
        related_skills = []
        
        # Check if the skill is in our normalized categories
        for category, skills in skill_categories.items():
            if skill_lower in [s.lower() for s in skills]:
                related_skills = [s for s in skills if s.lower() != skill_lower]
                break
        
        enriched_job_skills[skill] = {
            "direct_match": False,
            "category": None,
            "related_skills": related_skills
        }
    
    for skill in candidate_skills:
        skill_lower = skill.lower()
        related_skills = []
        
        # Check if the skill is in our normalized categories
        for category, skills in skill_categories.items():
            if skill_lower in [s.lower() for s in skills]:
                related_skills = [s for s in skills if s.lower() != skill_lower]
                break
        
        enriched_candidate_skills[skill] = {
            "direct_match": False,
            "category": None,
            "related_skills": related_skills
        }
    
    # Calculate score matrix
    matches = []
    total_score = 0
    max_possible_score = len(job_skills)  # Maximum score is one per job skill
    
    # For each job skill, find best matching candidate skill
    for job_skill in job_skills:
        best_match = None
        best_score = 0
        
        # First try direct matches
        for candidate_skill in candidate_skills:
            if job_skill.lower() == candidate_skill.lower():
                best_match = candidate_skill
                best_score = 1.0
                break
        
        # If no direct match, try category and semantic matching
        if not best_match:
            for candidate_skill in candidate_skills:
                # Check if job skill is a category and candidate skill belongs to it
                if job_skill in skill_categories and candidate_skill in skill_categories.get(job_skill, []):
                    score = 0.9
                # Check if candidate skill is a category and job skill belongs to it
                elif candidate_skill in skill_categories and job_skill in skill_categories.get(candidate_skill, []):
                    score = 0.9
                # Use semantic similarity
                else:
                    # Calculate semantic similarity using sentence transformers
                    embeddings = skills_model.encode([job_skill, candidate_skill])
                    similarity = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
                    score = float(similarity)
                
                if score > best_score:
                    best_score = score
                    best_match = candidate_skill
        
        # Add match to results
        if best_match:
            matches.append({
                "job_skill": job_skill,
                "candidate_skill": best_match,
                "score": best_score,
                "related": best_score < 1.0 and best_score >= 0.7,
                "category_match": job_skill in skill_categories and best_match in skill_categories and 
                                 skill_categories[job_skill] == skill_categories[best_match]
            })
            total_score += best_score
        else:
            matches.append({
                "job_skill": job_skill,
                "candidate_skill": None,
                "score": 0,
                "related": False,
                "category_match": False
            })
    
    # Calculate overall match percentage
    match_percentage = (total_score / max_possible_score) * 100 if max_possible_score > 0 else 0
    
    # Check for additional candidate skills not matched to job skills
    additional_skills = []
    matched_candidate_skills = {match["candidate_skill"] for match in matches if match["candidate_skill"]}
    for skill in candidate_skills:
        if skill not in matched_candidate_skills:
            # Find which job category it might belong to
            relevant_job_categories = set()
            skill_category = None
            
            for category, skills in skill_categories.items():
                if skill.lower() in [s.lower() for s in skills]:
                    skill_category = category
                    break
            
            for job_skill in job_skills:
                job_category = None
                for category, skills in skill_categories.items():
                    if job_skill.lower() in [s.lower() for s in skills]:
                        job_category = category
                        break
                
                if job_category and skill_category and job_category == skill_category:
                    relevant_job_categories.add(job_category)
            
            additional_skills.append({
                "skill": skill,
                "relevant_job_categories": list(relevant_job_categories)
            })
    
    return {
        "matches": matches,
        "total_score": total_score,
        "max_possible_score": max_possible_score,
        "match_percentage": match_percentage,
        "additional_skills": additional_skills
    }

# Main API endpoint
@app.post("/match")
async def match_candidate(request: MatchRequest):
    """
    Match a candidate's profile with job requirements.
    
    This endpoint combines degree matching, major matching, skills matching, and project matching
    to provide a comprehensive assessment of how well a candidate matches a job.
    """
    try:
        # 1. Degree matching
        degree_score = degree_similarity(request.candidate.degree, request.job.degree)
        
        # 2. Major matching
        major_score = compare_majors(request.job.major, request.candidate.major)
        major_score_percentage = round(float(major_score) * 100, 2)
        
        # 3. Skills matching
        skills_result = calculate_skills_similarity(request.job.skills, request.candidate.skills)
        
        # 4. Project matching
        project_match, project_report = calculate_job_match(request.job.skills, request.candidate.projects)
        
        # Calculate overall match score (weighted average)
        # Weights: degree (30%), major (20%), skills (30%), projects (20%)
        overall_score = (
            0.3 * degree_score +
            0.2 * major_score_percentage +
            0.3 * skills_result["match_percentage"] +
            0.2 * project_match
        )
        
        # Prepare response
        response = {
            "overall_match_percentage": round(overall_score, 2),
            "degree_match": {
                "score": degree_score,
                "candidate_degree": request.candidate.degree,
                "job_degree": request.job.degree
            },
            "major_match": {
                "score": major_score_percentage,
                "candidate_major": request.candidate.major,
                "job_major": request.job.major
            },
            "skills_match": {
                "match_percentage": round(skills_result["match_percentage"], 2),
                "matches": skills_result["matches"],
                "additional_skills": skills_result["additional_skills"]
            },
            "project_match": {
                "match_percentage": project_match,
                "project_matches": project_report["project_matches"],
                "skills_assessment": project_report["skills_assessment"],
                "missing_skills": project_report["missing_skills"],
                "job_domain": project_report["job_domain"]
            }
        }
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Individual endpoints for backward compatibility
@app.get("/compare-majors")
def compare_majors_endpoint(job_major: str, candidate_major: str):
    """Compare job major with candidate major."""
    similarity_score = compare_majors(job_major, candidate_major)
    return {"similarity": round(float(similarity_score), 3)}

@app.get("/compare-degrees")
def compare_degrees_endpoint(candidate_degree: str, job_requirement: str):
    """Compare candidate degree with job degree requirement."""
    similarity_score = degree_similarity(candidate_degree, job_requirement)
    return {"Degree Similarity Score": similarity_score}

@app.get("/match-skills")
async def match_skills_endpoint(job_skills: str, candidate_skills: str):
    """Match job skills with candidate skills."""
    try:
        # Split and clean the input skills
        job_skills_list = [skill.strip().lower() for skill in job_skills.split(",") if skill.strip()]
        candidate_skills_list = [skill.strip().lower() for skill in candidate_skills.split(",") if skill.strip()]
        
        if not job_skills_list or not candidate_skills_list:
            raise HTTPException(status_code=400, detail="Both job skills and candidate skills must be provided")
            
        # Perform matching
        result = calculate_skills_similarity(job_skills_list, candidate_skills_list)
        
        # Return only the match percentage
        return {"match_percentage": round(result["match_percentage"], 2)}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/match-projects")
async def match_projects_endpoint(job_skills: str, projects_json: str):
    """Match job skills with candidate projects."""
    try:
        # Parse job skills
        job_requirements = [skill.strip() for skill in job_skills.split(",") if skill.strip()]
        
        # Parse projects JSON
        try:
            projects_data = json.loads(projects_json)
            projects = projects_data.get("projects", [])
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid projects JSON format")
        
        if not job_requirements or not projects:
            raise HTTPException(status_code=400, detail="Both job skills and projects must be provided")
        
        # Calculate match
        overall_match, report = calculate_job_match(job_requirements, projects)
        
        # Create simplified response
        response = {
            "match_percentage": overall_match,
            "job_domain": report["job_domain"],
            "demonstrated_skills": [
                {
                    "skill": skill["skill"],
                    "match_type": skill["match_type"],
                    "projects": skill["projects"]
                }
                for skill in report["skills_assessment"]
                if skill["demonstrated"]
            ],
            "missing_skills": [
                skill["skill"]
                for skill in report["skills_assessment"]
                if not skill["demonstrated"]
            ],
            "project_rankings": [
                {
                    "name": proj["name"],
                    "match_percentage": proj["match_percentage"],
                    "matching_skills": proj["matching_skills"]
                }
                for proj in report["project_matches"]
            ]
        }
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/combined-match")
async def combined_match_get(
    job_degree: str,
    job_major: str,
    job_skills: str,
    candidate_degree: str,
    candidate_major: str,
    candidate_skills: str,
    projects_json: str
):
    """
    Combined matching endpoint that accepts all parameters as query parameters.
    
    Args:
        job_degree: Degree required for the job (e.g., "BTech", "MS")
        job_major: Major required for the job (e.g., "Computer Science")
        job_skills: Comma-separated list of skills required for the job
        candidate_degree: Candidate's degree (e.g., "MS", "BTech")
        candidate_major: Candidate's major (e.g., "Software Engineering")
        candidate_skills: Comma-separated list of candidate's skills
        projects_json: URL-encoded JSON string containing projects information
        
    Returns:
        Combined match score and detailed breakdown
    """
    try:
        # Parse job skills
        job_skills_list = [skill.strip().lower() for skill in job_skills.split(",") if skill.strip()]
        
        # Parse candidate skills
        candidate_skills_list = [skill.strip().lower() for skill in candidate_skills.split(",") if skill.strip()]
        
        # Parse projects JSON
        try:
            projects_data = json.loads(projects_json)
            projects = projects_data.get("projects", [])
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid projects JSON format")
        
        # 1. Degree matching
        degree_score = degree_similarity(candidate_degree, job_degree)
        
        # 2. Major matching
        major_score = compare_majors(job_major, candidate_major)
        major_score_percentage = round(float(major_score) * 100, 2)
        
        # 3. Skills matching
        skills_result = calculate_skills_similarity(job_skills_list, candidate_skills_list)
        
        # 4. Project matching
        project_match, project_report = calculate_job_match(job_skills_list, projects)
        
        # Calculate overall match score (weighted average)
        # Weights: degree (30%), major (20%), skills (30%), projects (20%)
        overall_score = (
            0.3 * degree_score +
            0.2 * major_score_percentage +
            0.3 * skills_result["match_percentage"] +
            0.2 * project_match
        )
        
        # Prepare response
        response = {
            "overall_match_percentage": round(overall_score, 2),
            "degree_match": {
                "score": degree_score,
                "candidate_degree": candidate_degree,
                "job_degree": job_degree
            },
            "major_match": {
                "score": major_score_percentage,
                "candidate_major": candidate_major,
                "job_major": job_major
            },
            "skills_match": {
                "match_percentage": round(skills_result["match_percentage"], 2),
                "matches": skills_result["matches"],
                "additional_skills": skills_result["additional_skills"]
            },
            "project_match": {
                "match_percentage": project_match,
                "project_matches": project_report["project_matches"],
                "skills_assessment": project_report["skills_assessment"],
                "missing_skills": project_report["missing_skills"],
                "job_domain": project_report["job_domain"]
            }
        }
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


# uvicorn combine_check:app --reload
# http://localhost:8000/combined-match?job_degree=BTech&job_major=Computer Science&job_skills=python,machine learning,sql&candidate_degree=MS&candidate_major=Software Engineering&candidate_skills=python,data analysis,postgresql&projects_json={"projects":[{"name":"ML Project","description":"Built ML model","skills":["python","tensorflow"]},{"name":"Data Analysis Project","description":"Analyzed customer data using SQL and Python","skills":["python","sql","data analysis"]}]}
