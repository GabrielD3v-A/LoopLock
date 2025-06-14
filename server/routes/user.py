# Módulos do projeto
from models.user import User
from db.db import db

# Flask
from flask import Blueprint, jsonify

# Flask-JWT-Extended
from flask_jwt_extended import jwt_required, get_jwt_identity

user = Blueprint('user', __name__)

# Rota para visualizar dados do usuário
@user.route('/user/get-user-data', methods=['GET'])
@jwt_required()
def get_user_data():

    try:

        # Recupera a identidade definida no token (email)
        identity = get_jwt_identity()

        # Procura o usuário no banco de dados
        user = User.get_user_by_email(identity)

        if not user:
            return jsonify({'message': 'Credencial não encontrada.'}), 404

        # Monta a resposta
        credential_data = {
            'user_username': user.user_username,
            'user_email': user.user_email,
            'created_at': user.created_at,
            'updated_at': user.updated_at
        }
        return jsonify({'user': credential_data}), 200

    # Tratamento de exceções
    except Exception as e:
        return jsonify({'message': f'Erro: {str(e)}'}), 500

# Rota para deletar usuário
@user.route('/user/delete-user-data', methods=['DELETE'])
@jwt_required()
def delete_user():

    # Recupera a identidade do usuário autenticado a partir do token JWT
    identity = get_jwt_identity()
    user = User.get_user_by_email(identity)
    if not user:
        return jsonify({'message': 'Usuário não encontrado.'}), 404

    try:
        # Remove o usuário do banco de dados
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'Usuário deletado com sucesso!'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Erro ao deletar usuário: {str(e)}'}), 500