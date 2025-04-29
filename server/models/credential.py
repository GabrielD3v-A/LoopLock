# user.py
from db.db import db
from slugify import slugify
import hashlib
import binascii
from datetime import datetime
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
    credential_name = db.Column(db.String(100), nullable=False)
    credential_username = db.Column(db.String(100), nullable=False)
    credential_password = db.Column(db.String(255), nullable=False)
    credential_domain = db.Column(db.String(100), nullable=False)
    credential_slug = db.Column(db.String(200), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)
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
    
    def encrypt_data(self, field, symetric_key):

        # Inicializa a criptografia da chave simétrica
        un_symetric_key = binascii.unhexlify(symetric_key)
        #aes_256_cipher = Cipher(algorithms.AES(binascii.unhexlify(symetric_key)), modes.ECB, backend=default_backend())
        aes_256_cipher = Cipher(algorithms.AES(un_symetric_key), modes.ECB, backend=default_backend())
        encryptor = aes_256_cipher.encryptor()

        # Cria um padder para garantir que o plaintext seja múltiplo de 16 bytes (tamanho do bloco AES)
        padder = padding.PKCS7(128).padder() # 128 = 16 bytes
        padded_field = padder.update(field) + padder.finalize()

        # Executa a criptografia
        protected_field = encryptor.update(padded_field) + encryptor.finalize()

        return protected_field
    
    def decrypt_data(self, field, symetric_key):

        # Cria o objetro decriptador com a o segredo imputado pelo usuário e o vetor de inicialiação utilizaods na criação da chave
        aes_256_cipher = Cipher(algorithms.AES(binascii.unhexlify(symetric_key)), modes.ECB, backend=self.backend)
        aes_256_decryptor = aes_256_cipher.decryptor()

        # Reverte o padder utilizado na criptografia
        padded_protected_field = aes_256_decryptor.update(symetric_key) + aes_256_decryptor.finalize()
        unpadder = padding.PKCS7(128).unpadder()

        # Decripta a chave protegida
        field = unpadder.update(padded_protected_field) + unpadder.finalize()

        # Retorna a chave symétrica decriptada em formato string hexadecimal
        return field

    # Gera um identificador único do registro com base em todos os campos fornecidos 
    def generate_slug(self, *fields):

        # Gera o hash em cima da slug com os campos fornecidos
        slug = hashlib.sha1(slugify("".join(str(field) for field in fields)).encode('utf-8')).hexdigest()
        self.credential_slug = slug

    @classmethod
    def get_credential_by_name(self, name):
        return self.query.filter_by(credential_name=name).first()
    
    @classmethod
    def get_credential_by_slug(self, credential_slug):
        return self.query.filter_by(credential_slug=credential_slug).first()
    
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
