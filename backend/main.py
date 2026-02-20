from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Session, create_engine, select, Field
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="Todo Backend HF")

# --- 1. CORS Configuration (Local aur Vercel ke liye) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Hackathon ke liye sab origins allow hain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 2. Database Setup ---
# check_same_thread=False SQLite ke liye zaroori hai FastAPI mein
DATABASE_URL = "sqlite:///./todo.db"
engine = create_engine(DATABASE_URL, echo=True, connect_args={"check_same_thread": False})

# --- 3. Models ---
class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: Optional[str] = None
    completed: bool = False

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None

# Database tables banane ka function
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# --- 4. Routes ---

@app.get("/")
def read_root():
    return {"message": "Backend is running! Go to /docs for API documentation."}

@app.get("/api/tasks")
def get_tasks():
    with Session(engine) as session:
        tasks = session.exec(select(Task)).all()
        return tasks

@app.post("/api/tasks")
def create_task(task: TaskCreate):
    with Session(engine) as session:
        new_task = Task.model_validate(task)
        session.add(new_task)
        session.commit()
        session.refresh(new_task)
        return new_task

@app.get("/api/tasks/{task_id}")
def get_task(task_id: int):
    with Session(engine) as session:
        task = session.get(Task, task_id)
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        return task

@app.put("/api/tasks/{task_id}")
def update_task(task_id: int, task_data: TaskCreate):
    with Session(engine) as session:
        existing_task = session.get(Task, task_id)
        if not existing_task:
            raise HTTPException(status_code=404, detail="Task not found")
        
        existing_task.title = task_data.title
        existing_task.description = task_data.description
        
        session.add(existing_task)
        session.commit()
        session.refresh(existing_task)
        return existing_task

@app.patch("/api/tasks/{task_id}/complete")
def complete_task(task_id: int):
    with Session(engine) as session:
        task = session.get(Task, task_id)
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        task.completed = True
        session.add(task)
        session.commit()
        session.refresh(task)
        return task

@app.delete("/api/tasks/{task_id}")
def delete_task(task_id: int):
    with Session(engine) as session:
        task = session.get(Task, task_id)
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        session.delete(task)
        session.commit()
        return {"ok": True}
if __name__ == "__main__":
    import uvicorn
    # Hugging Face default port 7860 use karta hai
    uvicorn.run(app, host="0.0.0.0", port=7860)    