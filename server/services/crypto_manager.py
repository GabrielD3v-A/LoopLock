from werkzeug.security import generate_password_hash, check_password_hash
import secrets
from cryptography.hazmat.primitives.ciphers import (
    Cipher, algorithms, modes
)
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from cryptography.hazmat.primitives import hashes, padding
from cryptography.hazmat.backends import default_backend

class CryptoManager:
    def __init__(self, master_password: str):
        """
        Inicializa o CryptoManager com uma senha mestra e gera uma chave derivada.
        """
        self.backend = default_backend()

        # Deriva a senha mestra utilizando PBKDF2-SHA256
        master_key = generate_password_hash(master_password, method='pbkdf2')

        self.master_key = master_key

    # Gera o hash que será gravado no banco de dados para validação do usuário ao realizar o login
    def generate_master_password_hash(self, master_password):
        
        # Deriva novamente a chave derivada com PBKDF2-SHA256 com mais uma derivação PBKDF2-SHA256
        master_password_hash = generate_password_hash(master_password, method='pbkdf2')

        self.master_password_hash = master_password_hash

    # Gera a o segredo usado para criptografar a chave simétrica do usuário
    def generate_stretched_master_password(self, master_password):

        hkdf = HKDF(
            algorithm=hashes.SHA256(),
            length=32,
            salt=None,
            info=b'',
            backend=default_backend()
        )
        stretched_master_key = hkdf.derive(master_password.encode("utf-8"))
        return stretched_master_key

    # Gera a chave simétrica responsável por criptografar o cofre do usuário e a criptografa
    def generate_symetric_key(self, stretched_master_password) -> tuple[bytes, bytes]:
        # Gera um vetor de inicialização para gerar a chave simétrica do usuário
        symetric_key = secrets.token_bytes(32)

        # Gera um vetor de inicialização para gerar a chave simétrica do usuário
        iv = secrets.token_bytes(16)

        # Inicializa a criptografia da chave simétrica
        aes_256_cipher = Cipher(algorithms.AES(stretched_master_password), modes.CBC(iv), backend=default_backend())
        encryptor = aes_256_cipher.encryptor()

        # Cria um padder para garantir que o plaintext seja múltiplo de 16 bytes (tamanho do bloco AES)
        padder = padding.PKCS7(128).padder() # 128 = 16 bytes
        padded_plaintext = padder.update(symetric_key) + padder.finalize()

        # Executa a criptografia
        protected_symetric_key = encryptor.update(padded_plaintext) + encryptor.finalize()

        self.protected_symetric_key = protected_symetric_key

    def decrypt_symetric_key(self, protected_symetric_key: bytes, iv: bytes) -> bytes:
        """
        Descriptografa um texto cifrado (ciphertext) usando AES-256 no modo CBC,
        retornando a chave simétrica original.
        """

        cipher = Cipher(algorithms.AES(self.derived_key), modes.CBC(iv), backend=self.backend)
        decryptor = cipher.decryptor()
        padded_plaintext = decryptor.update(protected_symetric_key) + decryptor.finalize()
        
        unpadder = padding.PKCS7(128).unpadder()
        plaintext = unpadder.update(padded_plaintext) + unpadder.finalize()

        return plaintext