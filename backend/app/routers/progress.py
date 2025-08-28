from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from app.database import SessionLocal
from app import models, schemas

router = APIRouter(prefix="/users", tags=["progress"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/{user_id}/progress", response_model=schemas.UserProgress)
def get_user_progress(user_id: int, db: Session = Depends(get_db)):
    # Létező user ellenőrzése
    user = db.query(models.User).get(user_id)
    if not user:
        raise HTTPException(404, "User nem található")

    # Témakörönkénti összesítés
    rows = (
        db.query(
            models.Topic.id.label("topic_id"),
            models.Topic.name.label("topic_name"),
            func.count(models.Task.id).label("total_tasks"),
            func.sum(func.case([(models.Attempt.is_correct==True, 1)], else_=0)).label("correct_attempts"),
            func.count(models.Attempt.id).label("total_attempts"),
        )
        .join(models.Task, models.Task.topic_id==models.Topic.id)
        .outerjoin(models.Attempt, 
                   (models.Attempt.task_id==models.Task.id) & 
                   (models.Attempt.user_id==user_id))
        .group_by(models.Topic.id)
        .all()
    )

    topics = [
        schemas.TopicProgress(
            topic_id=r.topic_id,
            topic_name=r.topic_name,
            total_tasks=r.total_tasks,
            correct_attempts=r.correct_attempts or 0,
            total_attempts=r.total_attempts or 0,
        )
        for r in rows
    ]

    return schemas.UserProgress(user_id=user_id, topics=topics)


@router.get("/{user_id}/attempts", response_model=List[schemas.AttemptOut])
def get_user_attempts(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).get(user_id)
    if not user:
        raise HTTPException(404, "User nem található")
    attempts = (
        db.query(models.Attempt)
        .filter(models.Attempt.user_id == user_id)
        .order_by(models.Attempt.attempted_at)
        .all()
    )
    return attempts
