from flask import Blueprint, request, jsonify
import uuid
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
from models.credential import Credential
from db.db import db

credential = Blueprint('credential', __name__)

# Rota para criar credenciais
@credential.route('/credential/create', methods=['POST'])
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
            credential_slug=str(uuid.uuid4()),
            user_id=user_id
        )

        # Criptografando os dados
        new_credential.hash_password(password)

        # Gera o ID automaticamente sem finalizar a transação
        new_credential.flush()

        # Gera a slug do objeto com todos os atributos mantendo a unicidade
        new_credential.generate_slug(new_credential.credential_id, new_credential.credential_name, new_credential.credential_password, new_credential.credential_domain)
        
        # Adicionando o novo usuário ao banco de dados
        new_credential.save()

        # Mensagem de sucesso
        return jsonify({'message': 'Credencial cadastrada com sucesso!'}), 201

    # Tratamento de exceções
    except Exception as e:
        db.session.rollback()  # Caso ocorra algum erro, fazemos o rollback
        return jsonify({'message': f'Erro: {str(e)}'}), 500

# Rota para visualizar credenciais
@credential.route('/credential/select/<credential_slug>', methods=['GET'])
@jwt_required()
def select_credential(credential_slug):
    try:
        credential = Credential.get_credential_by_slug(credential_slug)
        if not credential:
            return jsonify({'message': 'Credencial não encontrada.'}), 404
        
        credential_data = {
            'name': credential.credential_name,
            'username': credential.credential_username,
            'domain': credential.credential_domain
        }
        return jsonify({'credential': credential_data}), 200
        #return jsonify({'message': 'Under Development'}), 200
    except Exception as e:
        return jsonify({'message': f'Erro: {str(e)}'}), 500

# Rota para atualizar de credenciais
@credential.route('/update_credential/<int:credential_id>', methods=['PUT'])
@jwt_required()
def update_credential(credential_id):
    data = request.get_json()
    name = data.get('name')
    username = data.get('username')
    password = data.get('password')
    domain = data.get('domain')

    try:
        # Recupera a identidade do usuário autenticado
        identity = get_jwt_identity()
        user_id = User.get_user_id_by_email(identity)
        if not user_id:
            return jsonify({'message': 'Usuário não encontrado'}), 404
        
        # Busca a credencial pelo ID
        credential = Credential.get_credential_by_id(credential_id)
        if not credential:
            return jsonify({'message': 'Credencial não encontrada'}), 404
        
        # Verificar se a credencial pertence ao usuário autenticado
        if credential.user_id != user_id:
            return jsonify({'message': 'Não autorizado'}), 403
        
        # Atualiza apenas os campos que foram enviados
        if name is not None:
            credential.credential_name = name
        if username is not None:
            credential.credential_username = username
        if password is not None:
            credential.hash_password(password)
        if domain is not None:
            credential.credential_domain = domain

        db.session.commit()
        return jsonify({'message': 'Credencial atualizada com sucesso!'}), 200
    
    except Exception as e:
        return jsonify({'message': f'Erro: {str(e)}'}), 500

@credential.route('/delete_credential/<int:credential_id>', methods=['DELETE'])
@jwt_required()
def delete_credential(credential_id):

    # Recupera a identidade do usuário autenticado a partir do token JWT
    identity = get_jwt_identity()
    user_id = User.get_user_id_by_email(identity)
    if not user_id:
        return jsonify({'message': 'Usuário não encontrado.'}), 404
    
    # Busca a credencial pelo ID
    credential = Credential.get_credential_by_id(credential_id)
    if not credential:
        return jsonify({'message': 'Credencial não encontrada.'}), 404

    # Verifica se a credencial pertence ao usuário autenticado
    if credential.user_id != user_id:
        return jsonify({'message': 'Não autorizado para deletar esta credencial.'}), 403

    try:
        # Remove a credencial do banco de dados
        db.session.delete(credential)
        db.session.commit()
        return jsonify({'message': 'Credencial deletada com sucesso!'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Erro ao deletar credencial: {str(e)}'}), 500