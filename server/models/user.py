# user.py
from db.db import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'user'

    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_username = db.Column(db.String(255), nullable=False)
    user_email = db.Column(db.String(200), nullable=False, unique=True)
    user_master_password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def __init__(self, user_username, user_email, user_master_password):
        """
        Constructor for User model

        :param user_username: Username of the user
        :param user_email: Email of the user
        :param user_master_password: Master password of the user
        """
        self.user_username = user_username
        self.user_email = user_email
        self.user_master_password = user_master_password

    def __repr__(self):
        return f'<User {self.user_username}>'
