import hashlib
import binascii
import secrets
from cryptography.hazmat.primitives.ciphers import (
    Cipher, algorithms, modes
)
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from cryptography.hazmat.primitives import hashes, padding
from cryptography.hazmat.backends import default_backend

class CryptoManager:
    def __init__(self, master_password: str, email):
        """
        Inicializa o CryptoManager com a senha mestra deriva para a chave derivada.
        """

        # Configura o motor de criptografia padrão da classe
        self.backend = default_backend()

        # Deriva a senha mestra utilizando PBKDF2-SHA256 certificando-se de que a senha e salt são codificados para bytes
        master_key = hashlib.pbkdf2_hmac('sha256', master_password.encode('utf-8'), email.encode('utf-8'), 600000, 32)

        # Retorna a chave mestra do usuário em string hexadecimal
        self.master_key = binascii.hexlify(master_key).decode('utf-8')

    # Gera o hash que será gravado no banco de dados para validação do usuário ao realizar o login
    def generate_master_password_hash(self, master_key, master_password):

        # Deriva novamente a chave derivada com PBKDF2-SHA256 com mais uma derivação PBKDF2-SHA256
        master_password_hash = hashlib.pbkdf2_hmac('sha256', master_key.encode('utf-8'), master_password.encode('utf-8'), 600000, 32)

        # Retorna a o hash da senha do usuário em string hexadecimal
        self.master_password_hash = binascii.hexlify(master_password_hash).decode('utf-8')

    # Gera a o segredo (chave mestra drivada com HMAC-based Extract-and-Expand Key Derivation Function) usado para criptografar a chave simétrica do usuário
    def generate_stretched_master_password(self, master_password):

        # Configura o algoritmo para uso posterior na senha mestra
        hkdf = HKDF(
            algorithm=hashes.SHA256(),
            length=32,
            salt=None,
            info=b'',
            backend=default_backend()
        )

        # Deriva a chave mestra no segredo usando para posteriormente gerar a chave simétrica do usuário
        stretched_master_key = hkdf.derive(master_password.encode("utf-8"))
        return stretched_master_key

    # Gera a chave simétrica responsável por criptografar o cofre do usuário e a criptografa
    def generate_symetric_key(self, stretched_master_password) -> tuple[str, str]:
        # Gera a chave simétrica do usuário
        symetric_key = secrets.token_bytes(32)

        # Gera um vetor de inicialização para manter unicidade da chave simétrica do usuário
        iv = secrets.token_bytes(16)

        # Cria o objeto encrypt usando o hash fornecido e o vetor de inicialização
        aes_256_cipher = Cipher(algorithms.AES(stretched_master_password), modes.CBC(iv), backend=default_backend())

        # Cria o encriptador
        aes_256_encryptor = aes_256_cipher.encryptor()

        # Cria e executa um padder para garantir que a chave seja múltipla de 16 bytes (tamanho do bloco AES)
        padder = padding.PKCS7(128).padder() # 128 = 16 bytes
        padded_symetric_key = padder.update(symetric_key) + padder.finalize()

        # Executa a criptografia
        protected_symetric_key = aes_256_encryptor.update(padded_symetric_key) + aes_256_encryptor.finalize()

        # Retorna a chave simétrica protegida e o vetor de inicialização para serem gravados no banco em formato string hexadecimal
        return binascii.hexlify(protected_symetric_key).decode('utf-8'), binascii.hexlify(iv).decode('utf-8')

    def decrypt_symetric_key(self, streched_master_password, protected_symetric_key, iv) -> str:
        """
        Descriptografa a chave simétrica do usuário para operar no cofre
        """

        # Cria o objetro decriptador com a o segredo imputado pelo usuário e o vetor de inicialiação utilizaods na criação da chave
        aes_256_cipher = Cipher(algorithms.AES(streched_master_password), modes.CBC(binascii.unhexlify(iv)), backend=self.backend)
        aes_256_decryptor = aes_256_cipher.decryptor()

        # Reverte o padder utilizado na criptografia
        padded_symetric_key = aes_256_decryptor.update(binascii.unhexlify(protected_symetric_key)) + aes_256_decryptor.finalize()
        unpadder = padding.PKCS7(128).unpadder()

        # Decripta a chave protegida
        symetric_key = unpadder.update(padded_symetric_key) + unpadder.finalize()

        # Retorna a chave symétrica decriptada em formato string hexadecimal
        return binascii.hexlify(symetric_key).decode('utf-8')