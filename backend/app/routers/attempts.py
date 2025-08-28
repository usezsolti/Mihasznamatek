from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import SessionLocal

router = APIRouter(prefix="/attempts", tags=["attempts"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.AttemptOut)
def create_attempt(attempt: schemas.AttemptCreate, db: Session = Depends(get_db)):
    # 1) Lekérjük a task-ot a megoldással
    task = db.query(models.Task).get(attempt.task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task nem található")

    # 2) Egyszerű correct-check: string-equals a solution_text-tel
    is_correct = (attempt.answer_text.strip() == task.solution_text.strip())
    score = 1 if is_correct else 0

    # 3) Új Attempt objektum létrehozása és mentése
    db_attempt = models.Attempt(
        user_id=attempt.user_id,
        task_id=attempt.task_id,
        answer_text=attempt.answer_text,
        is_correct=is_correct,
        score=score
    )
    db.add(db_attempt)
    db.commit()
    db.refresh(db_attempt)

    return db_attempt
