# user.py
from db.db import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import secrets
from cryptography.hazmat.primitives.ciphers import (
    Cipher, algorithms, modes
)
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from cryptography.hazmat.primitives import hashes, padding
from cryptography.hazmat.backends import default_backend

class User(db.Model):
    __tablename__ = 'user'

    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_username = db.Column(db.String(255), nullable=False)
    user_email = db.Column(db.String(200), nullable=False, unique=True)
    user_master_password = db.Column(db.String(255), nullable=False)
    user_symetric_key = db.Column(db.String(256), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now, nullable=False)

    def __init__(self, user_username, user_email, user_master_password, user_symetric_key):
        """
        Constructor for User model

        :param user_username: Username of the user
        :param user_email: Email of the user
        :param user_master_password: Master password of the user
        """
        self.user_username = user_username
        self.user_email = user_email
        self.user_master_password = user_master_password
        self.user_symetric_key = user_symetric_key

    def __repr__(self):
        return f'<User {self.user_username}>'

    def set_password(self, password):
        return generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.user_master_password, password)
    
    @classmethod
    def get_user_by_email(self, email):
        return self.query.filter_by(user_email=email).first()
    
    @classmethod
    def get_user_id_by_email(self, email):
        return self.query.with_entities(self.user_id).filter_by(user_email=email).scalar()
    
    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        
        db.session.delete(self)
        db.session.commit()
