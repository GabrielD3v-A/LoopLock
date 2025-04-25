# user.py
from db.db import db
from datetime import datetime
import hashlib
import binascii
import hmac

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

    # Checa se o input de senha do usuário corresponde ao hash da senha para validar o login
    def check_master_password_hash(self, email, master_password, user_master_password_hash):

        # Deriva a senha mestra utilizando PBKDF2-SHA256 certificando-se de que a senha e salt são codificados para bytes
        attempt_master_key = binascii.hexlify(hashlib.pbkdf2_hmac('sha256', master_password.encode('utf-8'), email.encode('utf-8'), 600000, 32)).decode('utf-8')

        # Deriva a senha mestra utilizando PBKDF2-SHA256 certificando-se de que a senha e salt são codificados para bytes
        attempt_master_password_hash = binascii.hexlify(hashlib.pbkdf2_hmac('sha256', attempt_master_key.encode('utf-8'), master_password.encode('utf-8'), 600000, 32)).decode('utf-8')

        # Retona booleano na comparação dos hashs
        return hmac.compare_digest(user_master_password_hash, attempt_master_password_hash)
    
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
