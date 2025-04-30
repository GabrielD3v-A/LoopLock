# user.py
from db.db import db
from slugify import slugify
import hashlib
import binascii
from datetime import datetime
from models.user import User
from werkzeug.security import generate_password_hash, check_password_hash
from cryptography.hazmat.primitives.ciphers import (
    Cipher, algorithms, modes
)
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.backends import default_backend

class Credential(db.Model):
    __tablename__ = 'credential'

    credential_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    credential_name = db.Column(db.String(100), nullable=False, default=None)
    credential_username = db.Column(db.String(100), nullable=False, default=None)
    credential_password = db.Column(db.String(255), nullable=False, default=None)
    credential_domain = db.Column(db.String(100), nullable=False, default=None)
    credential_slug = db.Column(db.String(200), nullable=False, default=None)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False, default=None)
    created_at = db.Column(db.DateTime, default=datetime.now, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now, nullable=False)

    def __init__(self, credential_name, credential_username, credential_password, credential_domain, credential_slug, user_id):
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
        self.credential_slug = credential_slug
        self.user_id=user_id



    def __repr__(self):
        return f'<Credential {self.credential_name}>'
    
    # Função responsável por encriptar o campo fornecido que irá ser salvo no banco de dados
    def encrypt_data(self, field, symetric_key):

        # Inicializa a criptografia da chave simétrica
        aes_256_cipher = Cipher(algorithms.AES(binascii.unhexlify(symetric_key)), modes.ECB(), backend=default_backend())
        encryptor = aes_256_cipher.encryptor()

        # Cria um padder para garantir que o plaintext seja múltiplo de 16 bytes (tamanho do bloco AES)
        padder = padding.PKCS7(128).padder() # 128 = 16 bytes
        padded_field = padder.update(field.encode("utf-8")) + padder.finalize()

        # Executa a criptografia
        protected_field = encryptor.update(padded_field) + encryptor.finalize()

        return binascii.hexlify(protected_field).decode('utf-8')
    
    def decrypt_data(self, protected_field, symetric_key):

        # Cria o objetro decriptador com a o segredo imputado pelo usuário e o vetor de inicialiação utilizaods na criação da chave
        aes_256_cipher = Cipher(algorithms.AES(binascii.unhexlify(symetric_key)), modes.ECB(), backend=default_backend())
        aes_256_decryptor = aes_256_cipher.decryptor()

        # Reverte o padder utilizado na criptografia
        padded_protected_field = aes_256_decryptor.update(binascii.unhexlify(protected_field)) + aes_256_decryptor.finalize()
        unpadder = padding.PKCS7(128).unpadder()

        # Decripta a chave protegida
        field = unpadder.update(padded_protected_field) + unpadder.finalize()

        # Retorna a chave symétrica decriptada em formato string hexadecimal
        return field.decode('utf-8')

    # Gera um identificador único do registro com base em todos os campos fornecidos 
    def generate_slug(self, *fields):

        # Gera o hash em cima da slug com os campos fornecidos
        slug = hashlib.sha1(slugify("".join(str(field) for field in fields)).encode('utf-8')).hexdigest()
        self.credential_slug = slug

    @classmethod
    def init_select(cls, credential_name, credential_slug):
        return cls(
            credential_name = credential_name,
            credential_username=None,
            credential_password=None,
            credential_domain=None,
            credential_slug=credential_slug,
            user_id=None
        )

    @classmethod
    def get_credential_by_name(cls, name):
        return cls.query.filter_by(credential_name=name).first()
    
    @classmethod
    def get_credential_by_slug(cls, credential_slug):
        return cls.query.filter_by(credential_slug=credential_slug).first()
    
    @classmethod
    def get_all_credentials(cls, identity):
        return (
            cls.query
            .with_entities(Credential.credential_name, Credential.credential_slug)
            .select_from(User)
            .join(Credential, User.user_id == Credential.user_id)
            .filter(User.user_email.like(f"%{identity}%"))
            .all()
        )
    
    # Função para forçar a operação do banco de dados antes de commitar para gerar a slug a partir do ID
    def flush(self):
        db.session.add(self)
        db.session.flush()

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()
