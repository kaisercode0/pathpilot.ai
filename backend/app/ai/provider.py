import json
import logging
from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
import httpx
from app.core.config import settings
from app.ai.prompts import ROADMAP_SYSTEM_PROMPT, SKILL_ANALYSIS_SYSTEM_PROMPT

logger = logging.getLogger("pathpilot.ai")


class AIProvider(ABC):
    @abstractmethod
    async def generate_roadmap(
        self,
        user_profile: Dict[str, Any],
        goal: Dict[str, Any],
        assessment: Optional[Dict[str, Any]],
        weekly_hours: int,
        duration_weeks: int
    ) -> Dict[str, Any]:
        """Generate a complete structured roadmap with milestones and resources."""
        pass

    @abstractmethod
    async def analyze_skills(
        self,
        current_skills: List[str],
        target_role: str,
        goal_title: str
    ) -> Dict[str, Any]:
        """Perform skill gap analysis and return strengths, weaknesses, missing skills."""
        pass

    @abstractmethod
    async def evaluate_progress(
        self,
        roadmap: Dict[str, Any],
        user_progress: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Evaluate overall user progress across milestones."""
        pass

    @abstractmethod
    async def generate_learning_plan(
        self,
        goal_title: str,
        duration_weeks: int,
        weekly_hours: int
    ) -> Dict[str, Any]:
        """Generate high level sequence of learning themes."""
        pass

    @abstractmethod
    async def adapt_roadmap(
        self,
        roadmap: Dict[str, Any],
        trigger: str,
        params: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Adapt existing roadmap based on user feedback or speed changes."""
        pass


class MockAIProvider(AIProvider):
    """Deterministic, production-ready mock provider operating without external API keys."""

    async def analyze_skills(
        self,
        current_skills: List[str],
        target_role: str,
        goal_title: str
    ) -> Dict[str, Any]:
        curr_lower = [s.strip().lower() for s in current_skills]
        target_lower = (target_role or goal_title or "").lower()

        # Domain skill expectations dictionary
        domain_expectations = {
            "ai": ["Python", "PyTorch", "TensorFlow", "Math & Linear Algebra", "MLOps", "Transformers", "NLP", "Vector Databases"],
            "machine learning": ["Python", "Scikit-Learn", "PyTorch", "Data Analysis", "Feature Engineering", "MLOps"],
            "frontend": ["HTML/CSS", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS", "Web Performance"],
            "backend": ["Python/Node.js", "FastAPI/Express", "PostgreSQL", "SQLAlchemy", "REST APIs", "Docker", "Redis"],
            "full stack": ["HTML/CSS", "JavaScript", "TypeScript", "React", "Node.js/Python", "PostgreSQL", "Docker", "Git"],
            "cybersecurity": ["Networking Fundamentals", "Linux Security", "Network Analysis (Wireshark)", "Penetration Testing", "SIEM (Splunk)", "Cryptography"],
            "cloud": ["Linux", "AWS/GCP", "Docker", "Kubernetes", "Terraform", "CI/CD Pipelines"],
            "data": ["SQL", "Python", "Pandas", "Data Warehousing (Snowflake/BigQuery)", "Apache Spark", "Data Modeling"]
        }

        expected = ["Core Fundamentals", "Domain Tools", "Advanced Systems", "Project Engineering", "Deployment & Best Practices"]
        for key, skills_list in domain_expectations.items():
            if key in target_lower:
                expected = skills_list
                break

        existing = []
        missing = []
        scores = {}

        for skill in expected:
            if any(c in skill.lower() for c in curr_lower):
                existing.append(skill)
                scores[skill] = 0.85
            else:
                missing.append(skill)
                scores[skill] = 0.25

        strengths = existing if existing else ["Enthusiasm & Foundation Knowledge"]
        weaknesses = missing[:4] if missing else ["Advanced Production Experience"]

        return {
            "existing_skills": existing,
            "missing_skills": missing,
            "skill_proficiency": scores,
            "priority_skills": missing[:3] if missing else expected[:3],
            "recommended_learning_sequence": expected,
            "strengths": strengths,
            "weaknesses": weaknesses
        }

    async def generate_roadmap(
        self,
        user_profile: Dict[str, Any],
        goal: Dict[str, Any],
        assessment: Optional[Dict[str, Any]],
        weekly_hours: int,
        duration_weeks: int
    ) -> Dict[str, Any]:
        title = goal.get("title", "Career Advancement Path")
        target_role = goal.get("target_role") or title
        exp_level = user_profile.get("experience_level", "beginner")

        # Determine domain tailored milestones
        target_lower = target_role.lower()

        if "ai" in target_lower or "machine learning" in target_lower:
            milestones_data = [
                {
                    "title": "Python & Data Science Foundations",
                    "description": "Master core Python 3.12, NumPy, Pandas, and data analysis fundamentals.",
                    "estimated_hours": 30.0,
                    "skills": ["Python", "NumPy", "Pandas", "Data Cleaning"],
                    "resources": [
                        {
                            "title": "Python for Data Science Handbook",
                            "description": "Essential guide to Python data analysis tools.",
                            "resource_type": "book",
                            "url": "https://jakevdp.github.io/PythonDataScienceHandbook/",
                            "difficulty": "beginner",
                            "estimated_time": "15 hours",
                            "is_free": True,
                            "provider": "O'Reilly Open"
                        },
                        {
                            "title": "Kaggle Python Course",
                            "description": "Interactive hands-on Python exercises.",
                            "resource_type": "interactive",
                            "url": "https://www.kaggle.com/learn/python",
                            "difficulty": "beginner",
                            "estimated_time": "10 hours",
                            "is_free": True,
                            "provider": "Kaggle"
                        }
                    ]
                },
                {
                    "title": "Applied Machine Learning & Scikit-Learn",
                    "description": "Understand supervised and unsupervised algorithms, validation, and feature engineering.",
                    "estimated_hours": 45.0,
                    "skills": ["Scikit-Learn", "Model Evaluation", "Regression", "Classification"],
                    "resources": [
                        {
                            "title": "Hands-On Machine Learning with Scikit-Learn",
                            "description": "Industry reference textbook for ML engineers.",
                            "resource_type": "book",
                            "url": "https://github.com/ageron/handson-ml3",
                            "difficulty": "intermediate",
                            "estimated_time": "25 hours",
                            "is_free": True,
                            "provider": "GitHub Books"
                        }
                    ]
                },
                {
                    "title": "Deep Learning & Neural Networks with PyTorch",
                    "description": "Build neural networks, CNNs, and Transformers using PyTorch 2.x.",
                    "estimated_hours": 50.0,
                    "skills": ["PyTorch", "Neural Networks", "Deep Learning", "Transformers"],
                    "resources": [
                        {
                            "title": "PyTorch Deep Learning Official Tutorials",
                            "description": "Comprehensive tutorial suite by PyTorch Core team.",
                            "resource_type": "tutorial",
                            "url": "https://pytorch.org/tutorials/",
                            "difficulty": "intermediate",
                            "estimated_time": "20 hours",
                            "is_free": True,
                            "provider": "PyTorch"
                        }
                    ]
                },
                {
                    "title": "LLM Integration & Vector Search Engineering",
                    "description": "Build end-to-end RAG systems, integrate LLM APIs, and use Pinecone/Qdrant vector stores.",
                    "estimated_hours": 40.0,
                    "skills": ["RAG Architecture", "Vector Databases", "LangChain/LlamaIndex", "FastAPI"],
                    "resources": [
                        {
                            "title": "DeepLearning.AI Building RAG Systems",
                            "description": "Practical guide to enterprise vector search and LLM orchestration.",
                            "resource_type": "course",
                            "url": "https://www.deeplearning.ai/short-courses/",
                            "difficulty": "advanced",
                            "estimated_time": "15 hours",
                            "is_free": True,
                            "provider": "DeepLearning.AI"
                        }
                    ]
                },
                {
                    "title": "Capstone: Enterprise AI Agent Deployment",
                    "description": "Deploy a production-grade AI microservice with FastAPI, Docker, and ML monitoring.",
                    "estimated_hours": 35.0,
                    "skills": ["Docker", "FastAPI", "MLOps", "Model Deployment"],
                    "resources": [
                        {
                            "title": "FastAPI & Docker Production Architecture",
                            "description": "Complete guide to shipping async AI microservices.",
                            "resource_type": "doc",
                            "url": "https://fastapi.tiangolo.com/deployment/docker/",
                            "difficulty": "advanced",
                            "estimated_time": "10 hours",
                            "is_free": True,
                            "provider": "FastAPI Docs"
                        }
                    ]
                }
            ]
            insights = {
                "in_demand_skills": ["PyTorch", "RAG / Vector Databases", "FastAPI", "Docker", "MLOps"],
                "recommended_certifications": ["AWS Certified Machine Learning - Specialty", "TensorFlow Developer Certificate"],
                "portfolio_tips": ["Build a multi-agent RAG application with vector search", "Deploy fine-tuned open-source model as REST API"],
                "interview_prep_focus": ["Gradient descent & math fundamentals", "System design for scalable AI inferences"],
                "potential_job_titles": ["AI Engineer", "Machine Learning Engineer", "LLM Application Developer", "Applied AI Scientist"]
            }
        elif "cybersecurity" in target_lower or "security" in target_lower:
            milestones_data = [
                {
                    "title": "Networking Fundamentals & Protocol Analysis",
                    "description": "Master TCP/IP, OSI Model, DNS, Subnetting, and packet analysis with Wireshark.",
                    "estimated_hours": 30.0,
                    "skills": ["Networking Protocols", "Wireshark", "Packet Analysis", "Subnetting"],
                    "resources": [
                        {
                            "title": "Wireshark Packet Analysis Masterclass",
                            "description": "Hands-on network traffic analysis tutorial.",
                            "resource_type": "video",
                            "url": "https://www.wireshark.org/docs/",
                            "difficulty": "beginner",
                            "estimated_time": "15 hours",
                            "is_free": True,
                            "provider": "Wireshark Foundation"
                        }
                    ]
                },
                {
                    "title": "Linux Systems & Security Administration",
                    "description": "Linux shell scripting, user permissions, firewall rules, and system hardening.",
                    "estimated_hours": 35.0,
                    "skills": ["Linux Shell", "System Hardening", "IPTables/UFW", "File Permissions"],
                    "resources": [
                        {
                            "title": "OverTheWire Bandit Wargame",
                            "description": "Gamified Linux security challenge for security practitioners.",
                            "resource_type": "practice",
                            "url": "https://overthewire.org/wargames/bandit/",
                            "difficulty": "beginner",
                            "estimated_time": "20 hours",
                            "is_free": True,
                            "provider": "OverTheWire"
                        }
                    ]
                },
                {
                    "title": "Vulnerability Assessment & Penetration Testing",
                    "description": "Use Nmap, Metasploit, and Burp Suite to identify and remediate security vulnerabilities.",
                    "estimated_hours": 45.0,
                    "skills": ["Nmap", "Burp Suite", "Web Security", "OWASP Top 10"],
                    "resources": [
                        {
                            "title": "TryHackMe Web Fundamentals",
                            "description": "Interactive cybersecurity learning platform labs.",
                            "resource_type": "practice",
                            "url": "https://tryhackme.com/",
                            "difficulty": "intermediate",
                            "estimated_time": "25 hours",
                            "is_free": True,
                            "provider": "TryHackMe"
                        }
                    ]
                },
                {
                    "title": "SIEM Log Analysis & Incident Response",
                    "description": "Configure Splunk/ELK stack, analyze threat indicators, and handle security incidents.",
                    "estimated_hours": 40.0,
                    "skills": ["Splunk", "SIEM", "Log Analysis", "Incident Response"],
                    "resources": [
                        {
                            "title": "Splunk Fundamentals Course",
                            "description": "Official introduction to SOC log management and search query language.",
                            "resource_type": "course",
                            "url": "https://www.splunk.com/en_us/training.html",
                            "difficulty": "intermediate",
                            "estimated_time": "15 hours",
                            "is_free": True,
                            "provider": "Splunk"
                        }
                    ]
                }
            ]
            insights = {
                "in_demand_skills": ["Wireshark", "Burp Suite", "Linux Hardening", "SIEM / Splunk", "OWASP Top 10"],
                "recommended_certifications": ["CompTIA Security+", "Certified Ethical Hacker (CEH)", "OSCP"],
                "portfolio_tips": ["Document home lab setup with Security Onion or Splunk", "Publish writeups of TryHackMe / HackTheBox machines"],
                "interview_prep_focus": ["Network protocol handshakes", "Common web application attacks and remediations"],
                "potential_job_titles": ["Cybersecurity Analyst", "SOC Analyst", "Penetration Tester", "Information Security Specialist"]
            }
        else:
            # Default Software / Web / Full-Stack / General Roadmap Blueprint
            milestones_data = [
                {
                    "title": "Core Foundations & Modern Tooling",
                    "description": "Master core concepts, modern syntax, Git version control, and development environments.",
                    "estimated_hours": 25.0,
                    "skills": ["Core Programming", "Git", "Clean Code", "Environment Setup"],
                    "resources": [
                        {
                            "title": "Modern Software Engineering Principles",
                            "description": "Guide to building scalable maintainable applications.",
                            "resource_type": "doc",
                            "url": "https://developer.mozilla.org/",
                            "difficulty": "beginner",
                            "estimated_time": "12 hours",
                            "is_free": True,
                            "provider": "MDN Web Docs"
                        }
                    ]
                },
                {
                    "title": "Application Architecture & Data Persistence",
                    "description": "Build robust modular backend services, relational database schemas, and REST APIs.",
                    "estimated_hours": 35.0,
                    "skills": ["RESTful APIs", "SQL & Database Design", "ORM Architecture", "Authentication"],
                    "resources": [
                        {
                            "title": "Production Backend Architecture Guide",
                            "description": "Patterns for building high-performance backend APIs.",
                            "resource_type": "course",
                            "url": "https://fastapi.tiangolo.com/",
                            "difficulty": "intermediate",
                            "estimated_time": "18 hours",
                            "is_free": True,
                            "provider": "FastAPI Documentation"
                        }
                    ]
                },
                {
                    "title": "System Integration & Cloud Deployment",
                    "description": "Implement containerization with Docker, automated testing, and CI/CD deployment pipelines.",
                    "estimated_hours": 40.0,
                    "skills": ["Docker", "Automated Testing", "CI/CD", "Cloud Hosting"],
                    "resources": [
                        {
                            "title": "Docker & Containerization Mastery",
                            "description": "Complete guide to building containerized microservices.",
                            "resource_type": "tutorial",
                            "url": "https://docs.docker.com/get-started/",
                            "difficulty": "intermediate",
                            "estimated_time": "15 hours",
                            "is_free": True,
                            "provider": "Docker Docs"
                        }
                    ]
                },
                {
                    "title": "Capstone Engineering & Production Hardening",
                    "description": "Build and release an end-to-end full-stack platform with monitoring, caching, and security.",
                    "estimated_hours": 30.0,
                    "skills": ["Production Security", "Performance Tuning", "Full Stack Integration"],
                    "resources": [
                        {
                            "title": "Web Security Best Practices",
                            "description": "Hardening application endpoints against threats.",
                            "resource_type": "article",
                            "url": "https://owasp.org/",
                            "difficulty": "advanced",
                            "estimated_time": "10 hours",
                            "is_free": True,
                            "provider": "OWASP Foundation"
                        }
                    ]
                }
            ]
            insights = {
                "in_demand_skills": ["TypeScript/Python", "PostgreSQL", "Docker", "FastAPI/Next.js", "CI/CD"],
                "recommended_certifications": ["AWS Certified Solutions Architect", "Docker Certified Associate"],
                "portfolio_tips": ["Ship a full-stack open-source product with unit tests and Docker Compose", "Write clean README documentation"],
                "interview_prep_focus": ["System Architecture Design", "Data Structures & Database Optimization"],
                "potential_job_titles": ["Software Engineer", "Backend Developer", "Full Stack Engineer", "Systems Architect"]
            }

        # Build formatted milestone dicts with order indices
        formatted_milestones = []
        for idx, m in enumerate(milestones_data, 1):
            formatted_milestones.append({
                "order_index": idx,
                "title": m["title"],
                "description": m["description"],
                "estimated_hours": m["estimated_hours"],
                "skills": m["skills"],
                "status": "not_started",
                "resources": m["resources"]
            })

        return {
            "title": f"{target_role} Mastery Roadmap",
            "description": f"Customized {duration_weeks}-week roadmap for mastering {target_role} at {weekly_hours} hours per week.",
            "duration": f"{duration_weeks} weeks",
            "difficulty": exp_level,
            "generated_by": "mock",
            "career_insights": insights,
            "milestones": formatted_milestones
        }

    async def evaluate_progress(
        self,
        roadmap: Dict[str, Any],
        user_progress: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        total_m = len(roadmap.get("milestones", []))
        completed_m = sum(1 for p in user_progress if p.get("status") == "completed")
        percentage = (completed_m / total_m * 100.0) if total_m > 0 else 0.0

        return {
            "overall_percentage": round(percentage, 2),
            "completed_milestones": completed_m,
            "total_milestones": total_m,
            "status": "on_track" if percentage >= 25.0 else "getting_started",
            "recommendation": "Keep building hands-on capstone projects!"
        }

    async def generate_learning_plan(
        self,
        goal_title: str,
        duration_weeks: int,
        weekly_hours: int
    ) -> Dict[str, Any]:
        return {
            "goal": goal_title,
            "total_hours": duration_weeks * weekly_hours,
            "phases": [
                "Phase 1: Fundamental Concepts & Tools",
                "Phase 2: Core Engineering & Frameworks",
                "Phase 3: Real-World Applications & Integration",
                "Phase 4: Capstone Release & Optimization"
            ]
        }

    async def adapt_roadmap(
        self,
        roadmap: Dict[str, Any],
        trigger: str,
        params: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Adapt roadmap based on deterministic rules."""
        milestones = list(roadmap.get("milestones", []))

        if trigger == "weekly_hours_changed":
            new_hours = params.get("new_weekly_hours", 15)
            # Adjust estimated hours or scale duration
            for m in milestones:
                m["estimated_hours"] = round(m["estimated_hours"] * (15.0 / max(new_hours, 1)), 1)
        elif trigger == "low_assessment_score":
            # Insert prerequisite reinforcement milestone at the beginning
            prereq_milestone = {
                "order_index": 1,
                "title": "Reinforcement: Fundamental Concept Refresher",
                "description": "Targeted practice module added to strengthen foundational skill gaps.",
                "estimated_hours": 15.0,
                "skills": ["Foundational Logic", "Core Concepts"],
                "status": "not_started",
                "resources": [
                    {
                        "title": "Interactive Fundamentals Refresher",
                        "description": "Step-by-step remediation guide.",
                        "resource_type": "practice",
                        "url": "https://developer.mozilla.org",
                        "difficulty": "beginner",
                        "estimated_time": "10 hours",
                        "is_free": True,
                        "provider": "PathPilot Remediation Engine"
                    }
                ]
            }
            # Shift order index of existing milestones
            for m in milestones:
                m["order_index"] = m.get("order_index", 1) + 1
            milestones.insert(0, prereq_milestone)
        elif trigger == "completed_early":
            # Mark milestone completed and highlight next target
            completed_id = params.get("completed_milestone_id")
            for idx, m in enumerate(milestones):
                if str(m.get("id")) == str(completed_id):
                    m["status"] = "completed"
                    if idx + 1 < len(milestones):
                        milestones[idx + 1]["status"] = "in_progress"

        roadmap["milestones"] = milestones
        return roadmap


class OpenAIProvider(AIProvider):
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.model = settings.OPENAI_MODEL

    async def generate_roadmap(self, user_profile: Dict[str, Any], goal: Dict[str, Any], assessment: Optional[Dict[str, Any]], weekly_hours: int, duration_weeks: int) -> Dict[str, Any]:
        if not self.api_key:
            return await MockAIProvider().generate_roadmap(user_profile, goal, assessment, weekly_hours, duration_weeks)

        prompt = f"""
        User Goal: {goal.get('title')} ({goal.get('description', '')})
        Target Role: {goal.get('target_role', '')}
        Experience Level: {user_profile.get('experience_level', 'beginner')}
        Current Skills: {user_profile.get('current_skills', [])}
        Weekly Commitment: {weekly_hours} hours/week
        Target Duration: {duration_weeks} weeks
        Preferred Learning Style: {user_profile.get('preferred_learning_style', 'balanced')}

        Generate a detailed learning roadmap JSON.
        """
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"},
                    json={
                        "model": self.model,
                        "messages": [
                            {"role": "system", "content": ROADMAP_SYSTEM_PROMPT},
                            {"role": "user", "content": prompt}
                        ],
                        "response_format": {"type": "json_object"},
                        "temperature": 0.3
                    }
                )
                response.raise_for_status()
                data = response.json()
                content = data["choices"][0]["message"]["content"]
                result = json.loads(content)
                result["generated_by"] = "openai"
                return result
        except Exception as e:
            logger.error(f"OpenAI generation failed: {e}. Falling back to Mock Provider.")
            return await MockAIProvider().generate_roadmap(user_profile, goal, assessment, weekly_hours, duration_weeks)

    async def analyze_skills(self, current_skills: List[str], target_role: str, goal_title: str) -> Dict[str, Any]:
        return await MockAIProvider().analyze_skills(current_skills, target_role, goal_title)

    async def evaluate_progress(self, roadmap: Dict[str, Any], user_progress: List[Dict[str, Any]]) -> Dict[str, Any]:
        return await MockAIProvider().evaluate_progress(roadmap, user_progress)

    async def generate_learning_plan(self, goal_title: str, duration_weeks: int, weekly_hours: int) -> Dict[str, Any]:
        return await MockAIProvider().generate_learning_plan(goal_title, duration_weeks, weekly_hours)

    async def adapt_roadmap(self, roadmap: Dict[str, Any], trigger: str, params: Dict[str, Any]) -> Dict[str, Any]:
        return await MockAIProvider().adapt_roadmap(roadmap, trigger, params)


class AnthropicProvider(AIProvider):
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.model = settings.ANTHROPIC_MODEL

    async def generate_roadmap(self, user_profile: Dict[str, Any], goal: Dict[str, Any], assessment: Optional[Dict[str, Any]], weekly_hours: int, duration_weeks: int) -> Dict[str, Any]:
        if not self.api_key:
            return await MockAIProvider().generate_roadmap(user_profile, goal, assessment, weekly_hours, duration_weeks)

        prompt = f"""
        User Goal: {goal.get('title')} ({goal.get('description', '')})
        Target Role: {goal.get('target_role', '')}
        Experience Level: {user_profile.get('experience_level', 'beginner')}
        Current Skills: {user_profile.get('current_skills', [])}
        Weekly Commitment: {weekly_hours} hours/week
        Target Duration: {duration_weeks} weeks

        Generate a detailed learning roadmap JSON.
        """
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    "https://api.anthropic.com/v1/messages",
                    headers={
                        "x-api-key": self.api_key,
                        "anthropic-version": "2023-06-01",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": self.model,
                        "max_tokens": 4096,
                        "system": ROADMAP_SYSTEM_PROMPT,
                        "messages": [{"role": "user", "content": prompt}]
                    }
                )
                response.raise_for_status()
                data = response.json()
                content = data["content"][0]["text"]
                # Strip backticks if present
                clean_text = content.replace("```json", "").replace("```", "").strip()
                result = json.loads(clean_text)
                result["generated_by"] = "anthropic"
                return result
        except Exception as e:
            logger.error(f"Anthropic generation failed: {e}. Falling back to Mock Provider.")
            return await MockAIProvider().generate_roadmap(user_profile, goal, assessment, weekly_hours, duration_weeks)

    async def analyze_skills(self, current_skills: List[str], target_role: str, goal_title: str) -> Dict[str, Any]:
        return await MockAIProvider().analyze_skills(current_skills, target_role, goal_title)

    async def evaluate_progress(self, roadmap: Dict[str, Any], user_progress: List[Dict[str, Any]]) -> Dict[str, Any]:
        return await MockAIProvider().evaluate_progress(roadmap, user_progress)

    async def generate_learning_plan(self, goal_title: str, duration_weeks: int, weekly_hours: int) -> Dict[str, Any]:
        return await MockAIProvider().generate_learning_plan(goal_title, duration_weeks, weekly_hours)

    async def adapt_roadmap(self, roadmap: Dict[str, Any], trigger: str, params: Dict[str, Any]) -> Dict[str, Any]:
        return await MockAIProvider().adapt_roadmap(roadmap, trigger, params)


class GeminiProvider(AIProvider):
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.model = settings.GEMINI_MODEL

    async def generate_roadmap(self, user_profile: Dict[str, Any], goal: Dict[str, Any], assessment: Optional[Dict[str, Any]], weekly_hours: int, duration_weeks: int) -> Dict[str, Any]:
        if not self.api_key:
            return await MockAIProvider().generate_roadmap(user_profile, goal, assessment, weekly_hours, duration_weeks)

        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.api_key}"
            prompt = f"{ROADMAP_SYSTEM_PROMPT}\n\nGoal: {goal.get('title')}\nCurrent Skills: {user_profile.get('current_skills', [])}"
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    url,
                    headers={"Content-Type": "application/json"},
                    json={"contents": [{"parts": [{"text": prompt}]}]}
                )
                response.raise_for_status()
                data = response.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                clean_text = text.replace("```json", "").replace("```", "").strip()
                result = json.loads(clean_text)
                result["generated_by"] = "gemini"
                return result
        except Exception as e:
            logger.error(f"Gemini generation failed: {e}. Falling back to Mock Provider.")
            return await MockAIProvider().generate_roadmap(user_profile, goal, assessment, weekly_hours, duration_weeks)

    async def analyze_skills(self, current_skills: List[str], target_role: str, goal_title: str) -> Dict[str, Any]:
        return await MockAIProvider().analyze_skills(current_skills, target_role, goal_title)

    async def evaluate_progress(self, roadmap: Dict[str, Any], user_progress: List[Dict[str, Any]]) -> Dict[str, Any]:
        return await MockAIProvider().evaluate_progress(roadmap, user_progress)

    async def generate_learning_plan(self, goal_title: str, duration_weeks: int, weekly_hours: int) -> Dict[str, Any]:
        return await MockAIProvider().generate_learning_plan(goal_title, duration_weeks, weekly_hours)

    async def adapt_roadmap(self, roadmap: Dict[str, Any], trigger: str, params: Dict[str, Any]) -> Dict[str, Any]:
        return await MockAIProvider().adapt_roadmap(roadmap, trigger, params)


def get_ai_provider(provider_name: Optional[str] = None) -> AIProvider:
    provider = (provider_name or settings.AI_PROVIDER).lower()
    api_key = settings.AI_API_KEY

    if provider == "openai":
        return OpenAIProvider(api_key=api_key)
    elif provider == "anthropic":
        return AnthropicProvider(api_key=api_key)
    elif provider == "gemini":
        return GeminiProvider(api_key=api_key)
    else:
        return MockAIProvider()
