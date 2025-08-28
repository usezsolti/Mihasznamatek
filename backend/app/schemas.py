from pydantic import BaseModel
from datetime import datetime
from typing import List

class TopicProgress(BaseModel):
    topic_id: int
    topic_name: str
    total_tasks: int
    correct_attempts: int
    total_attempts: int

    class Config:
        orm_mode = True

class UserProgress(BaseModel):
    user_id: int
    topics: List[TopicProgress]

    class Config:
        orm_mode = True

class AttemptOut(BaseModel):
    id: int
    task_id: int
    is_correct: bool
    score: int
    attempted_at: datetime

    class Config:
        orm_mode = True
