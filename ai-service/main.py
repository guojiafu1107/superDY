from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uuid
import redis
import json
import os

from services.script_generator import ScriptGenerator
from services.style_analyzer import StyleAnalyzer
from services.video_analyzer import VideoAnalyzer
from services.title_generator import TitleGenerator

app = FastAPI(title="SuperDY AI Service", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Redis client
redis_client = redis.Redis(
    host=os.getenv("REDIS_HOST", "localhost"),
    port=int(os.getenv("REDIS_PORT", 6379)),
    db=0,
    decode_responses=True
)

# Initialize services
script_generator = ScriptGenerator()
style_analyzer = StyleAnalyzer()
video_analyzer = VideoAnalyzer()
title_generator = TitleGenerator()

# Models
class ScriptGenerateRequest(BaseModel):
    topic: str
    duration: int = 30
    tone: str = "professional"
    target_audience: Optional[str] = None
    use_web_search: bool = False
    style_profile: Optional[Dict[str, Any]] = None

class ScriptGenerateResponse(BaseModel):
    task_id: str
    status: str

class VideoAnalyzeRequest(BaseModel):
    share_url: str

class StyleAnalyzeRequest(BaseModel):
    user_id: str
    recent_videos: List[Dict[str, Any]]

class TitleGenerateRequest(BaseModel):
    topic: str
    content: str
    count: int = 10

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "ai-service"}

@app.post("/tasks/script/generate", response_model=ScriptGenerateResponse)
async def generate_script(request: ScriptGenerateRequest, background_tasks: BackgroundTasks):
    """Generate video script asynchronously"""
    task_id = str(uuid.uuid4())
    
    # Store initial task status
    redis_client.setex(f"ai_task:{task_id}", 3600, json.dumps({
        "status": "pending",
        "type": "script_generate",
        "progress": 0
    }))
    
    # Process in background
    background_tasks.add_task(process_script_generation, task_id, request)
    
    return ScriptGenerateResponse(task_id=task_id, status="pending")

@app.get("/tasks/{task_id}")
async def get_task_status(task_id: str):
    """Get task status and result"""
    task_data = redis_client.get(f"ai_task:{task_id}")
    if not task_data:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return json.loads(task_data)

@app.post("/tasks/style/analyze")
async def analyze_style(request: StyleAnalyzeRequest, background_tasks: BackgroundTasks):
    """Analyze user's content style"""
    task_id = str(uuid.uuid4())
    
    redis_client.setex(f"ai_task:{task_id}", 3600, json.dumps({
        "status": "pending",
        "type": "style_analyze",
        "progress": 0
    }))
    
    background_tasks.add_task(process_style_analysis, task_id, request)
    
    return {"task_id": task_id, "status": "pending"}

@app.post("/tasks/video/analyze")
async def analyze_video(request: VideoAnalyzeRequest, background_tasks: BackgroundTasks):
    """Analyze video content"""
    task_id = str(uuid.uuid4())
    
    redis_client.setex(f"ai_task:{task_id}", 3600, json.dumps({
        "status": "pending",
        "type": "video_analyze",
        "progress": 0
    }))
    
    background_tasks.add_task(process_video_analysis, task_id, request)
    
    return {"task_id": task_id, "status": "pending"}

@app.post("/tasks/titles/generate")
async def generate_titles(request: TitleGenerateRequest):
    """Generate title suggestions"""
    titles = title_generator.generate(
        topic=request.topic,
        content=request.content,
        count=request.count
    )
    
    return {"titles": titles}

# Background task processors
async def process_script_generation(task_id: str, request: ScriptGenerateRequest):
    """Process script generation in background"""
    try:
        # Update status to processing
        redis_client.setex(f"ai_task:{task_id}", 3600, json.dumps({
            "status": "processing",
            "type": "script_generate",
            "progress": 10
        }))
        
        # Generate script
        result = script_generator.generate(
            topic=request.topic,
            duration=request.duration,
            tone=request.tone,
            target_audience=request.target_audience,
            style_profile=request.style_profile
        )
        
        # Store result
        redis_client.setex(f"ai_task:{task_id}", 3600, json.dumps({
            "status": "completed",
            "type": "script_generate",
            "progress": 100,
            "result": result
        }))
        
    except Exception as e:
        redis_client.setex(f"ai_task:{task_id}", 3600, json.dumps({
            "status": "failed",
            "type": "script_generate",
            "error": str(e)
        }))

async def process_style_analysis(task_id: str, request: StyleAnalyzeRequest):
    """Process style analysis in background"""
    try:
        redis_client.setex(f"ai_task:{task_id}", 3600, json.dumps({
            "status": "processing",
            "type": "style_analyze",
            "progress": 50
        }))
        
        result = style_analyzer.analyze(request.recent_videos)
        
        redis_client.setex(f"ai_task:{task_id}", 3600, json.dumps({
            "status": "completed",
            "type": "style_analyze",
            "progress": 100,
            "result": result
        }))
        
    except Exception as e:
        redis_client.setex(f"ai_task:{task_id}", 3600, json.dumps({
            "status": "failed",
            "type": "style_analyze",
            "error": str(e)
        }))

async def process_video_analysis(task_id: str, request: VideoAnalyzeRequest):
    """Process video analysis in background"""
    try:
        redis_client.setex(f"ai_task:{task_id}", 3600, json.dumps({
            "status": "processing",
            "type": "video_analyze",
            "progress": 30
        }))
        
        result = video_analyzer.analyze(request.share_url)
        
        redis_client.setex(f"ai_task:{task_id}", 3600, json.dumps({
            "status": "completed",
            "type": "video_analyze",
            "progress": 100,
            "result": result
        }))
        
    except Exception as e:
        redis_client.setex(f"ai_task:{task_id}", 3600, json.dumps({
            "status": "failed",
            "type": "video_analyze",
            "error": str(e)
        }))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
