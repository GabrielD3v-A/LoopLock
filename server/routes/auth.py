from flask import Blueprint, jsonify, request
from models.user import User
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, jwt_required
from db import db

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
        
        existing_user = User.get_user_by_email(email)
        if existing_user:
            return jsonify(message="E-mail já cadastrado."), 403

        # Criando um novo usuário
        new_user = User(
            user_username=username,
            user_email=email,
            user_master_password=password
        )
        new_user.set_password(password) 
        # Adicionando o novo usuário ao banco de dados
        new_user.save()

        return jsonify({'message': 'Usuário cadastrado com sucesso!'}), 201

    except Exception as e:
        db.session.rollback()  # Caso ocorra algum erro, fazemos o rollback
        return jsonify({'message': f'Erro: {str(e)}'}), 500

# Rota para login de usuários
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()  # Recebe os dados enviados no corpo da requisição
    email = data.get('email')
    password = data.get('password')


    try:
        # Verificando se o usuário existe no banco
        user = User.get_user_by_email(email)

        if user:
            stored_password = user.user_master_password  # A senha armazenada na tabela

            # Verifica se a senha fornecida corresponde à senha armazenada
            if user.check_password(password):
                access_token = create_access_token(identity=user.user_email)
                refresh_token =  create_refresh_token(identity=user.user_email)
                return jsonify({
                    'message': 'Login realizado com sucesso!',
                    'access_token': access_token,
                    'refresh_token': refresh_token
                }), 200
            else:
                return jsonify(message="Campos de login inválidos!"), 401
        else:
            return jsonify(message="Usuário não encontrado!"), 404
    except Exception as e:
        return jsonify(message=f"Erro: {str(e)}"), 500


@auth_bp.route('/refresh', methods=['GET'])
@jwt_required(refresh=True)
def refresh_access_token():
    identity = get_jwt_identity()
    new_access_token = create_access_token(identity=identity)
    return jsonify(access_token=new_access_token), 200