from configparser import Error
from flask import Blueprint, request, jsonify, make_response # type: ignore
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
from models.credential import Credential
from db.db import db

main_routes = Blueprint('main_routes', __name__)

# Rota para criar credenciais
@main_routes.route('/create_credential', methods=['POST'])
@jwt_required()
def create_credential():

    data = request.get_json()
    name = data.get('name')
    username = data.get('username')
    password = data.get('password')
    domain = data.get('domain')

    try:
         # Verificando se todos os campos foram fornecidos
        if not name:
            return jsonify({'message': 'A credencial precisa conter um nome.'}), 400
        
        # Recupera a identidade definida no token (email)
        identity = get_jwt_identity()

        # Procura o usuário no banco de dados
        user_id = User.get_user_id_by_email(identity)
        if not user_id:
            return jsonify({'message': 'Usuário não encontrado.'}), 404
        
        # Criando uma nova credencial
        new_credential = Credential(
            credential_name=name,
            credential_username=username,
            credential_password=password,
            credential_domain=domain,
            user_id=user_id
        )

        # Criptografando os dados
        new_credential.hash_password(password)

        # Adicionando o novo usuário ao banco de dados
        new_credential.save()

        # Mensagem de sucesso
        return jsonify({'message': 'Credencial cadastrada com sucesso!'}), 201

    # Tratamento de exceções
    except Exception as e:
        db.session.rollback()  # Caso ocorra algum erro, fazemos o rollback
        return jsonify({'message': f'Erro: {str(e)}'}), 500

# Rota para deletar credenciais
@main_routes.route('/select_credential', methods=['GET'])
@jwt_required()
def select_credential():
    return jsonify({'message': 'Under Development'}), 200

# Rota para atualizar de credenciais
@main_routes.route('/update_credential/<int:id>', methods=['PUT'])
def update_credential():
    return jsonify({'message': 'Under Development'}), 200

@main_routes.route('/delete_credential/<int:id>', methods=['DELETE'])
def delete_credential():
    return jsonify({'message': 'Under Development'}), 200