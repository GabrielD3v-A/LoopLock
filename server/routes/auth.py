from flask import Blueprint, jsonify, request
from models.user import User
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, jwt_required
from db.db import db
from services.crypto_manager import CryptoManager

# Criar um blueprint para agrupar as rotas principais
auth_bp = Blueprint('auth', __name__)

# Rota para registro de usuários
@auth_bp.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
   
    try:
        # Verificando se todos os campos foram fornecidos
        if not username or not email or not password:
            return jsonify({'message': 'Username, email, and password are required'}), 400
        
        # Verifica duplicidade de usuário no banco
        existing_user = User.get_user_by_email(email)
        if existing_user:
            return jsonify(message="Dados inválidos."), 403
    
        # Cria o objeto gerenciador da criptografia e derivação de chaves
        crypto_manager = CryptoManager(password, email)

        # Gera o hash da senha do usuário para validar o login
        crypto_manager.generate_master_password_hash(crypto_manager.master_key, password)
        
        # Gera a chave symétrica protegida e o vetor de inicialização usado na chave simétrica
        protected_symetric_key, iv = crypto_manager.generate_symetric_key(crypto_manager.generate_stretched_master_password(crypto_manager.master_key))

        # Criando um novo usuário
        new_user = User(
            user_username=username,
            user_email=email,
            user_master_password=crypto_manager.master_password_hash,
            user_symetric_key=protected_symetric_key+iv # Chave protegida concatenada com o vetor de inicialização para decriptar o cofre no login
        )

        # Adicionando o novo usuário ao banco de dados
        new_user.save()

        # Mensagem para o front end
        return jsonify({'message': 'Usuário cadastrado com sucesso!'}), 201

    except Exception as e:
        db.session.rollback()  # Caso ocorra algum erro, fazemos o rollback
        return jsonify({'message': f'Erro: {str(e)}'}), 500

# Rota para login de usuários
@auth_bp.route('/login', methods=['POST'])
def login():
    
    # Recebe os dados enviados no corpo da requisição
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    try:
        # Verificando se o usuário existe no banco
        user = User.get_user_by_email(email)
        if user:

            # Verifica se a senha fornecida corresponde à senha armazenada
            if user.check_master_password_hash(email, password, user.user_master_password):
                access_token = create_access_token(identity=user.user_email)
                refresh_token =  create_refresh_token(identity=user.user_email)
                
                # Cria o objeto gerenciador da criptografia e derivação de chaves
                crypto_manager = CryptoManager(password, email)

                # Decripta a chave simétrica do usuário passando a senha mestra do usuário derivada com HKDF e o vetor de inicialização
                symetric_key = crypto_manager.decrypt_symetric_key(crypto_manager.generate_stretched_master_password(crypto_manager.master_key), user.user_symetric_key[:96], user.user_symetric_key[96:])
                return jsonify({
                    'message': 'Login realizado com sucesso!',
                    'access_token': access_token,
                    'refresh_token': refresh_token,
                    'symetric_key': symetric_key # Retorna a chave simétrica para a sessão do usuário para operar no cofre
                }), 200
            else:
                # Mensagem genérica em caso de dados incorretos
                return jsonify(message="Dados inválidos."), 401
        else:
            # Mensagem genérica caso o usuário não exista
            return jsonify(message="Dados inválidos."), 404
        
    except Exception as e:
        return jsonify(message=f"Erro: {str(e)}"), 500


@auth_bp.route('/refresh', methods=['GET'])
@jwt_required(refresh=True)
def refresh_access_token():
    identity = get_jwt_identity()
    new_access_token = create_access_token(identity=identity)
    return jsonify(access_token=new_access_token), 200