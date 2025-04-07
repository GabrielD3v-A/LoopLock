# user.py
from db.db import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash 

class Credential(db.Model):
    __tablename__ = 'credential'

    credential_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    credential_name = db.Column(db.String(100), nullable=False)
    credential_username = db.Column(db.String(100), nullable=False)
    credential_password = db.Column(db.String(255), nullable=False)
    credential_domain = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now, nullable=False)

    def __init__(self, credential_name, credential_username, credential_password, credential_domain, user_id):
        """
        Constructor for User model

        :param user_username: Username of the user
        :param user_email: Email of the user
        :param user_master_password: Master password of the user
        """
        self.credential_name = credential_name
        self.credential_username = credential_username
        self.credential_password = credential_password
        self.credential_domain = credential_domain
        self.user_id=user_id

    def __repr__(self):
        return f'<Credential {self.credential_name}>'
    
    def hash_password(self, password):
        self.credential_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.credential_password, password)
    
    @classmethod
    def get_credential_by_name(self, name):
        return self.query.filter_by(credential_email=name).first()
    
    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()
