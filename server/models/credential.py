# Módulos Nativos
from datetime import datetime
import hashlib
import binascii
import secrets

# Módulos do projeto
from db.db import db
from models.user import User

# cryptography
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
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
    
    @staticmethod
    def norm_to_128(field: bytes) -> bytes:
        if len(field) < 112:
            return field.ljust(112, b'\x00')
        else:
            return field[:112]
        
    @staticmethod
    def unorm_from_128(field: bytes) -> bytes:
        return field.rstrip(b'\x00')

    # Função responsável por encriptar o campo fornecido que irá ser salvo no banco de dados
    def encrypt_data(self, field: str, symetric_key: str) -> str:

        # Transforma o valor do campo em seu valor binário para criptografia
        field = field.encode("utf-8")

        # Converte a chave simétrica em sua forma binária para operar a criptografia
        symetric_key = binascii.unhexlify(symetric_key)

        # Gera um vetor de inicialização para manter unicidade da criptografia
        iv = secrets.token_bytes(16)

        # Instancia a criptografia com o vetor de inicialização e a chave simétrica
        aes_256_cipher = Cipher(algorithms.AES(symetric_key), modes.CBC(iv), backend=default_backend())
        encryptor = aes_256_cipher.encryptor()

        # Cria um padder para garantir que o plaintext seja múltiplo de 16 bytes (tamanho do bloco AES)
        padder = padding.PKCS7(128).padder() # 128 = 16 bytes
        padded_field = padder.update(field) + padder.finalize()

        # Normaliza o campo após o padding para garantir que ele tenha um tamanho fixo de 128 bytes
        norm_field = self.norm_to_128(padded_field)

        # Executa a criptografia
        protected_field = encryptor.update(norm_field) + encryptor.finalize()

        #return binascii.hexlify(protected_field).decode('utf-8') # Chave protegida em formato String


        return (
            binascii.hexlify(protected_field).decode('utf-8') + # Chave protegida em formato String
            binascii.hexlify(iv).decode('utf-8') # Vetor de inicialização em formato String
        )

    def decrypt_data(self, credencial_field: str, symetric_key: str):

        # Converte a chave protegida, o campo protegido  e o vetor de inicialização em suas formas binárias para operar a criptografia
        symetric_key = binascii.unhexlify(symetric_key)
        protected_field = binascii.unhexlify(credencial_field[:224])
        iv = binascii.unhexlify(credencial_field[224:])

        # Cria o objetro decriptador com a o segredo imputado pelo usuário e o vetor de inicialiação utilizaods na criação da chave
        aes_256_cipher = Cipher(algorithms.AES(symetric_key), modes.CBC(iv), backend=default_backend())
        aes_256_decryptor = aes_256_cipher.decryptor()

        # Decripta a chave protegida
        padded_protected_field = aes_256_decryptor.update(protected_field) + aes_256_decryptor.finalize()

        # Desfaz a normalização do campo o campo após o padding para garantir que ele tenha um tamanho fixo de 128 bytes
        unorm_field = self.unorm_from_128(padded_protected_field)

        # Reverte o padder utilizado na criptografia
        unpadder = padding.PKCS7(128).unpadder()
        field = unpadder.update(unorm_field) + unpadder.finalize()

        # Retorna a chave symétrica decriptada em formato string hexadecimal
        return field.decode('utf-8')

    # Gera um identificador único do registro com base em todos os campos fornecidos 
    def generate_slug(self, *fields):

        # Gera o hash em cima da slug com os campos fornecidos
        slug = hashlib.sha1("".join(str(field) for field in fields).encode('utf-8')).hexdigest()
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
