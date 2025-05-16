from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class ToDo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    task = db.Column(db.String(200), nullable=False)
    is_done = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            "id": self.id,
            "task": self.task,
            "is_done": self.is_done
        }