from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Text, Boolean,
    DateTime, ForeignKey
)
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"
    id         = Column(Integer, primary_key=True, index=True)
    name       = Column(String(100), nullable=False)
    email      = Column(String(255), unique=True, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    attempts   = relationship("Attempt", back_populates="user")


class Topic(Base):
    __tablename__ = "topics"
    id          = Column(Integer, primary_key=True, index=True)
    name        = Column(String(100), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    created_at  = Column(DateTime, default=datetime.utcnow)

    tasks       = relationship("Task", back_populates="topic")


class Task(Base):
    __tablename__ = "tasks"
    id            = Column(Integer, primary_key=True, index=True)
    topic_id      = Column(Integer, ForeignKey("topics.id"), nullable=False)
    question_text = Column(Text, nullable=False)
    solution_text = Column(Text, nullable=False)
    created_at    = Column(DateTime, default=datetime.utcnow)

    topic     = relationship("Topic", back_populates="tasks")
    attempts  = relationship("Attempt", back_populates="task")


class Attempt(Base):
    __tablename__ = "attempts"
    id           = Column(Integer, primary_key=True, index=True)
    user_id      = Column(Integer, ForeignKey("users.id"), nullable=False)
    task_id      = Column(Integer, ForeignKey("tasks.id"), nullable=False)
    answer_text  = Column(Text, nullable=False)
    is_correct   = Column(Boolean, nullable=False)
    score        = Column(Integer, nullable=False, default=0)
    attempted_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="attempts")
    task = relationship("Task", back_populates="attempts")
