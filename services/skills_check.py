import requests
import numpy as np
from typing import List, Dict, Set
import os
import json
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from fuzzywuzzy import fuzz
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List

class ESCOSkillsMatchingSystem:
    def __init__(self, use_cache=True):
        """
        Initialize the skills matching system with ESCO integration
        
        Args:
            use_cache: Whether to cache ESCO API responses
        """
        self.use_cache = use_cache
        self.cache_dir = "esco_cache"
        self.esco_base_url = "https://esco.ec.europa.eu/api"  # Updated API URL
        
        # Create cache directory if it doesn't exist
        if self.use_cache and not os.path.exists(self.cache_dir):
            os.makedirs(self.cache_dir)
        
        # Load sentence transformer model for semantic similarity
        self.model = SentenceTransformer('paraphrase-MiniLM-L6-v2')
        
        # Knowledge base of broader skill categories and their related skills
        self.skill_categories = {
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
            "backend development": [
                "node.js", "express", "django", "flask", "fastapi", "php", "laravel", 
                "ruby on rails", "spring boot", "java", "c#", ".net", "api", "rest", "graphql",
                "database", "mysql", "postgresql", "mongodb", "redis", "orm", "microservices"
            ],
            "devops": [
                "docker", "kubernetes", "aws", "azure", "gcp", "terraform", "ansible", "jenkins",
                "gitlab ci", "github actions", "ci/cd", "infrastructure as code", "monitoring",
                "logging", "linux", "bash", "shell", "cloud computing", "networking", "security"
            ],
            "mobile development": [
                "android", "ios", "swift", "kotlin", "react native", "flutter", "xamarin",
                "mobile ui", "responsive design", "app development", "mobile app", "hybrid app"
            ],
            "cloud computing": [
                "aws", "amazon web services", "azure", "google cloud platform", "gcp",
                "lambda", "ec2", "s3", "kubernetes", "serverless", "cloud formation",
                "terraform", "cloud storage", "cloud security", "multi-cloud",
                "load balancing", "auto-scaling", "cloud migration", "cloudwatch"
            ],
            "cybersecurity": [
                "network security", "ethical hacking", "penetration testing", "siem",
                "soc", "firewalls", "vpn", "encryption", "ssl/tls", "owasp",
                "vulnerability assessment", "incident response", "iso 27001", "pci dss",
                "zero trust", "iam", "saml", "oauth", "jwt", "waf"
            ],
            "testing/qa": [
                "unit testing", "integration testing", "test automation", "selenium",
                "cypress", "jest", "junit", "pytest", "load testing", "jmeter",
                "postman", "soapui", "tdd", "bdd", "testrail", "qa processes",
                "regression testing", "ci/cd pipelines", "performance testing"
            ],
            "frontend development": [
                "react", "angular", "vue", "svelte", "redux", "mobx",
                "web components", "accessibility", "wcag", "responsive design",
                "cross-browser compatibility", "web performance", "lighthouse",
                "graphql", "apollo", "webassembly", "progressive enhancement"
            ],
            "database": [
                "sql", "nosql", "mysql", "postgresql", "mongodb", "redis",
                "cassandra", "dynamodb", "database design", "orm", "prisma",
                "sqlalchemy", "indexing", "query optimization", "acid",
                "transactions", "replication", "sharding", "data modeling"
            ],
            "networking": [
                "tcp/ip", "dns", "http/https", "rest", "grpc", "websockets",
                "cdn", "vpc", "subnets", "routing", "load balancers", "api gateway",
                "network security", "ssh", "ssl termination", "packet analysis",
                "wireshark", "osi model", "latency optimization"
            ],
            "ui/ux design": [
                "figma", "sketch", "adobe xd", "user research", "wireframing",
                "prototyping", "design systems", "material design", "usability testing",
                "interaction design", "user flows", "information architecture",
                "responsive design", "mobile-first design", "a/b testing", "heuristic evaluation"
            ],
            "blockchain/web3": [
                "solidity", "smart contracts", "ethereum", "hyperledger", "nft",
                "defi", "web3.js", "ether.js", "truffle", "hardhat", "ipfs",
                "consensus algorithms", "tokenomics", "dapp development", "daos",
                "cryptography", "zero-knowledge proofs", "layer 2 solutions"
            ],
            "devops/sre": [
                "observability", "prometheus", "grafana", "elk stack", "splunk",
                "chaos engineering", "disaster recovery", "incident management",
                "service level objectives", "error budgets", "capacity planning",
                "cost optimization", "gitops", "argo cd", "spinnaker", "immutable infrastructure"
            ],
            "machine learning ops": [
                "mlflow", "kubeflow", "model deployment", "model monitoring",
                "feature stores", "data versioning", "a/b testing models",
                "model quantization", "onnx", "tf serving", "vertex ai",
                "sagemaker", "distributed training", "hyperparameter tuning"
            ],
            "embedded systems": [
                "iot", "arduino", "raspberry pi", "rtos", "firmware",
                "device drivers", "sensors", "bluetooth low energy", "zigbee",
                "memory management", "power optimization", "embedded linux",
                "real-time systems", "can bus", "modbus", "industrial protocols"
            ],
            "soft skills": [
                "communication", "teamwork", "problem-solving", "critical thinking",
                "time management", "agile methodology", "scrum", "kanban",
                "mentoring", "technical writing", "stakeholder management",
                "conflict resolution", "presentation skills", "remote collaboration"
            ],
            "game development": [
                "unity", "unreal engine", "c#", "3d modeling", "physics engines",
                "shaders", "vr development", "ar development", "game ai",
                "multiplayer networking", "particle systems", "animation systems",
                "game optimization", "procedural generation", "game design patterns"
            ],
            "quantum computing": [
                "qiskit", "quantum algorithms", "quantum circuits", "qubit",
                "superposition", "entanglement", "quantum error correction",
                "quantum cryptography", "quantum machine learning", "shor's algorithm"
            ]
        }
        
        # Normalize and expand skill categories for lookup
        self.normalized_categories = self._normalize_skill_categories()
        
        # Initialize cache for ESCO API calls
        self.api_cache = {}
        self._load_cache()
    
    def _normalize_skill_categories(self) -> Dict[str, str]:
        """Create lookup dictionary of skills to their categories"""
        normalized = {}
        for category, skills in self.skill_categories.items():
            for skill in skills:
                normalized[skill] = category
            # Add the category name itself as a skill
            normalized[category] = category
        return normalized
    
    def _load_cache(self) -> None:
        """Load cached ESCO API responses"""
        if not self.use_cache:
            return
            
        cache_file = os.path.join(self.cache_dir, "esco_cache.json")
        if os.path.exists(cache_file):
            try:
                with open(cache_file, 'r') as f:
                    self.api_cache = json.load(f)
                print(f"Loaded {len(self.api_cache)} cached items from {cache_file}")
            except Exception as e:
                print(f"Error loading cache: {e}")
                self.api_cache = {}
        else:
            print(f"No cache file found at {cache_file}. Starting with empty cache.")
            self.api_cache = {}
    
    def _save_cache(self) -> None:
        """Save cached ESCO API responses to file"""
        if not self.use_cache:
            return
            
        cache_file = os.path.join(self.cache_dir, "esco_cache.json")
        try:
            with open(cache_file, 'w') as f:
                json.dump(self.api_cache, f)
            print(f"Saved {len(self.api_cache)} items to cache at {cache_file}")
        except Exception as e:
            print(f"Error saving cache: {e}")
    
    def query_esco_api(self, endpoint: str, params: Dict = None) -> Dict:
        """
        Query the ESCO API with caching
        
        Args:
            endpoint: API endpoint to query
            params: Query parameters
            
        Returns:
            JSON response from the API
        """
        # Create cache key from endpoint and params
        cache_key = f"{endpoint}_{json.dumps(params or {})}"
        
        # Check cache first
        if cache_key in self.api_cache:
            return self.api_cache[cache_key]
        
        # Prepare headers for JSON response
        headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
        
        # Query API
        url = f"{self.esco_base_url}/{endpoint}"
        try:
            # Print the full URL for debugging
            print(f"Requesting URL: {url}")
            print(f"With params: {params}")
            
            response = requests.get(url, params=params, headers=headers)
            
            # Check content type
            content_type = response.headers.get('Content-Type', '')
            if 'application/json' not in content_type and 'text/json' not in content_type:
                print(f"Warning: Response is not JSON. Content-Type: {content_type}")
                print(f"Response preview: {response.text[:200]}...")
                return {}
            
            if response.status_code == 200:
                result = response.json()
                
                # Cache result
                if self.use_cache:
                    self.api_cache[cache_key] = result
                    self._save_cache()
                    
                return result
            else:
                print(f"ESCO API error: {response.status_code} - {response.text}")
                return {}
        except Exception as e:
            print(f"Error querying ESCO API: {e}")
            return {}
    
    def get_esco_skill_info(self, skill: str) -> Dict:
        """
        Get skill information from ESCO API or local knowledge base
        
        Args:
            skill: Skill to search for
            
        Returns:
            Dictionary with skill information including URI and related skills
        """
        skill_lower = skill.lower()
        
        # Create cache key for this skill
        cache_key = f"local_skill_{skill_lower}"
        
        # Check cache first
        if cache_key in self.api_cache:
            return self.api_cache[cache_key]
        
        skill_info = {
            "uri": None,
            "exact_match": False,
            "related_skills": [],
            "broader_skills": [],
            "narrower_skills": []
        }
        
        # Always use our local knowledge base for tech skills
        # This is more reliable than the ESCO API for programming languages and frameworks
        
        # Check if the skill is in our normalized categories
        if skill_lower in self.normalized_categories:
            category = self.normalized_categories[skill_lower]
            related_skills = []
            
            # Get all skills in the same category
            for category_skill in self.skill_categories[category]:
                if category_skill.lower() != skill_lower:
                    related_skills.append(category_skill)
            
            skill_info["uri"] = f"local:{skill_lower}"
            skill_info["exact_match"] = True
            skill_info["related_skills"] = related_skills
            
            # Cache the result
            if self.use_cache:
                self.api_cache[cache_key] = skill_info
                self._save_cache()
                
            return skill_info
        
        # If not found in our knowledge base, try to find similar skills
        for category, skills in self.skill_categories.items():
            for category_skill in skills:
                # Calculate similarity between the input skill and category skill
                similarity = fuzz.ratio(skill_lower, category_skill.lower())
                
                # If similarity is high enough, consider it a match
                if similarity > 80:
                    related_skills = []
                    for related_skill in skills:
                        if related_skill.lower() != category_skill.lower():
                            related_skills.append(related_skill)
                    
                    skill_info["uri"] = f"local:{category_skill.lower()}"
                    skill_info["exact_match"] = similarity > 90
                    skill_info["related_skills"] = related_skills
                    
                    # Cache the result
                    if self.use_cache:
                        self.api_cache[cache_key] = skill_info
                        self._save_cache()
                        
                    return skill_info
        
        # If no match found, still cache the empty result
        if self.use_cache:
            self.api_cache[cache_key] = skill_info
            self._save_cache()
            
        # If no match found, return empty skill info
        return skill_info
    
    def enrich_skills_with_esco(self, skills: List[str]) -> Dict[str, Dict]:
        """
        Enrich skills with ESCO data and relationships
        
        Args:
            skills: List of skills to enrich
            
        Returns:
            Dictionary mapping skills to their related skills from ESCO
        """
        enriched_skills = {}
        
        for skill in skills:
            # Get skill info from ESCO
            skill_info = self.get_esco_skill_info(skill)
            
            # If no info found in ESCO, use our knowledge base
            if not skill_info["uri"]:
                related_skills = []
                
                # Check if skill is in our category knowledge base
                if skill in self.normalized_categories:
                    category = self.normalized_categories[skill]
                    # Get all skills in the same category
                    for category_skill in self.skill_categories[category]:
                        if category_skill != skill:
                            related_skills.append(category_skill)
                
                enriched_skills[skill] = {
                    "direct_match": False,
                    "category": self.normalized_categories.get(skill),
                    "related_skills": related_skills
                }
            else:
                # Use ESCO data
                category = None
                if skill in self.normalized_categories:
                    category = self.normalized_categories[skill]
                
                enriched_skills[skill] = {
                    "direct_match": skill_info["exact_match"],
                    "category": category,
                    "related_skills": skill_info["related_skills"]
                }
        
        return enriched_skills
    
    def calculate_similarity(self, skill1: str, skill2: str) -> float:
        """
        Calculate similarity between two skills
        
        Args:
            skill1: First skill
            skill2: Second skill
            
        Returns:
            Similarity score between 0 and 1
        """
        # Check for exact match
        if skill1.lower() == skill2.lower():
            return 1.0
        
        # Check if skills are in the same category
        skill1_category = self.normalized_categories.get(skill1.lower())
        skill2_category = self.normalized_categories.get(skill2.lower())
        
        if skill1_category and skill2_category and skill1_category == skill2_category:
            return 0.9
        
        # Check if one skill is the category of the other
        if skill1_category == skill2.lower() or skill2_category == skill1.lower():
            return 0.9
        
        # Calculate semantic similarity using sentence transformers
        embeddings = self.model.encode([skill1, skill2])
        similarity = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
        
        return float(similarity)
    
    def match_skills(self, job_skills: List[str], candidate_skills: List[str]) -> Dict:
        """
        Match candidate skills with job requirements and calculate score
        
        Args:
            job_skills: List of skills required for the job
            candidate_skills: List of skills possessed by the candidate
            
        Returns:
            Dictionary with matching results and scores
        """
        # Enrich skills with ESCO and knowledge base
        enriched_job_skills = self.enrich_skills_with_esco(job_skills)
        enriched_candidate_skills = self.enrich_skills_with_esco(candidate_skills)
        
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
                    if job_skill in self.skill_categories and candidate_skill in self.skill_categories.get(job_skill, []):
                        score = 0.9
                    # Check if candidate skill is a category and job skill belongs to it
                    elif candidate_skill in self.skill_categories and job_skill in self.skill_categories.get(candidate_skill, []):
                        score = 0.9
                    # Use semantic similarity
                    else:
                        score = self.calculate_similarity(job_skill, candidate_skill)
                    
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
                    "category_match": job_skill in self.normalized_categories and best_match in self.normalized_categories and 
                                     self.normalized_categories[job_skill] == self.normalized_categories[best_match]
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
                skill_category = self.normalized_categories.get(skill.lower())
                
                for job_skill in job_skills:
                    job_category = self.normalized_categories.get(job_skill.lower())
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

# Create FastAPI app
app = FastAPI(
    title="Skills Matching API",
    description="API for matching job requirements with candidate skills"
)

# Define request/response models
class SkillsMatchRequest(BaseModel):
    job_skills: List[str]
    candidate_skills: List[str]

class SkillMatch(BaseModel):
    job_skill: str
    candidate_skill: str | None
    score: float
    related: bool
    category_match: bool

class AdditionalSkill(BaseModel):
    skill: str
    relevant_job_categories: List[str]

class SkillsMatchResponse(BaseModel):
    matches: List[SkillMatch]
    total_score: float
    max_possible_score: float
    match_percentage: float
    additional_skills: List[AdditionalSkill]

# Initialize the matcher
matcher = ESCOSkillsMatchingSystem()

@app.post("/match-skills", response_model=SkillsMatchResponse)
async def match_skills(request: SkillsMatchRequest):
    """
    Match job requirements with candidate skills and return detailed analysis
    """
    try:
        # Clean and normalize input skills
        job_skills = [skill.strip().lower() for skill in request.job_skills if skill.strip()]
        candidate_skills = [skill.strip().lower() for skill in request.candidate_skills if skill.strip()]
        
        if not job_skills or not candidate_skills:
            raise HTTPException(status_code=400, detail="Both job skills and candidate skills must be provided")
            
        # Perform matching
        result = matcher.match_skills(job_skills, candidate_skills)
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/match-percentage")
async def get_match_percentage(job_skills: str, candidate_skills: str):
    """
    Get match percentage between job skills and candidate skills
    Skills should be comma-separated in the URL
    Example: /match-percentage?job_skills=python,javascript,react&candidate_skills=python,nodejs,react
    """
    try:
        # Split and clean the input skills
        job_skills_list = [skill.strip().lower() for skill in job_skills.split(",") if skill.strip()]
        candidate_skills_list = [skill.strip().lower() for skill in candidate_skills.split(",") if skill.strip()]
        
        if not job_skills_list or not candidate_skills_list:
            raise HTTPException(status_code=400, detail="Both job skills and candidate skills must be provided")
            
        # Perform matching
        result = matcher.match_skills(job_skills_list, candidate_skills_list)
        
        # Return only the match percentage
        return {"match_percentage": round(result["match_percentage"], 2)}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


# uvicorn esco-skills-matching:app --reload
# http://localhost:8000/match-percentage?job_skills=python,javascript,react,restful%20apis&candidate_skills=nodejs,react
