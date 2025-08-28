"""create initial tables

Revision ID: 20250806_create_initial_tables
Revises: 
Create Date: 2025-08-06 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# azonosító, amit Alembic generál
revision = '20250806_create_initial_tables'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # users tábla
    op.create_table(
        'users',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('email', sa.String(255), nullable=False, unique=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
    )
    # topics tábla
    op.create_table(
        'topics',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('name', sa.String(100), nullable=False, unique=True),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
    )
    # tasks tábla
    op.create_table(
        'tasks',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('topic_id', sa.Integer, sa.ForeignKey('topics.id'), nullable=False),
        sa.Column('question_text', sa.Text, nullable=False),
        sa.Column('solution_text', sa.Text, nullable=False),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
    )
    # attempts tábla
    op.create_table(
        'attempts',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('user_id', sa.Integer, sa.ForeignKey('users.id'), nullable=False),
        sa.Column('task_id', sa.Integer, sa.ForeignKey('tasks.id'), nullable=False),
        sa.Column('answer_text', sa.Text, nullable=False),
        sa.Column('is_correct', sa.Boolean, nullable=False),
        sa.Column('score', sa.Integer, nullable=False, server_default="0"),
        sa.Column('attempted_at', sa.DateTime, server_default=sa.func.now()),
    )


def downgrade():
    op.drop_table('attempts')
    op.drop_table('tasks')
    op.drop_table('topics')
    op.drop_table('users')
