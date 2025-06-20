# Módulos Nativos
import uuid

# Módulos do projeto
from models.user import User
from models.credential import Credential
from db.db import db

# Flask
from flask import Blueprint, request, jsonify

# Flask-JWT-Extended
from flask_jwt_extended import jwt_required, decode_token

credential = Blueprint('credential', __name__)

# Rota para criar credenciais
@credential.route('/credential/create', methods=['POST'])
@jwt_required()
def create_credential():

    # Recupera dados enviados pelo usuário e a chave simétrica
    data = request.get_json()
    name = data.get('name')
    username = data.get('username')
    password = data.get('password')
    domain = data.get('domain')
    symetric_key = data.get('symetric_key')
    jwt = data.get('jwt')

    try:
        # Verificando se todos os campos foram fornecidos
        if not name:
            return jsonify({'message': 'A credencial precisa conter um nome.'}), 400
        
        # Verifica se os campos tem até 128 caracteres
        if len(name) | len(username) | len(password) | len(domain) > 128:
            return jsonify({'message': 'O campo não pode exceder 128 caracteres.'}), 400

        # Recupera a identidade definida no token (email)
        identity = decode_token(jwt).get('sub')

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
        new_credential.credential_name = new_credential.encrypt_data(new_credential.credential_name, symetric_key)
        new_credential.credential_username = new_credential.encrypt_data(new_credential.credential_username, symetric_key)
        new_credential.credential_password = new_credential.encrypt_data(new_credential.credential_password, symetric_key)
        new_credential.credential_domain = new_credential.encrypt_data(new_credential.credential_domain, symetric_key)

        # Gera o ID automaticamente sem finalizar a transação
        new_credential.flush()

        # Gera a slug do objeto com todos os atributos mantendo a unicidade
        new_credential.generate_slug(new_credential.credential_id, new_credential.credential_name, new_credential.credential_password, new_credential.credential_domain)
        #new_credential.credential_slug = new_credential.encrypt_data(new_credential.credential_slug, symetric_key)

        # Adicionando o novo usuário ao banco de dados
        new_credential.save()

        # Mensagem de sucesso
        return jsonify({'message': 'Credencial cadastrada com sucesso!'}), 201

    # Tratamento de exceções
    except Exception as e:
        db.session.rollback()  # Caso ocorra algum erro, fazemos o rollback
        return jsonify({'message': f'Erro: {str(e)}'}), 500

# Rota para visualizar todas as credenciais por nome
@credential.route('/credential/list', methods=['POST'])
@jwt_required()
def select_all_credentials():

    # Recupera a chave simétrica
    data = request.get_json()
    symetric_key = data.get('symetric_key')
    jwt = data.get('jwt')

    try:
        # Recupera a identidade definida no token (email)
        identity = decode_token(jwt).get('sub')

        # Procura o usuário no banco de dados
        user_id = User.get_user_id_by_email(identity)
        if not user_id:
            return jsonify({'message': 'Usuário não encontrado.'}), 404
        
        # Busca todas as credenciais do usuário da sessão
        credential_list = Credential.get_all_credentials(identity)

        # Prepara a lista para arranjar todas as credenciais e enviar na resposta
        credential_json_list = []
        for credential in credential_list:
            credential_inst = []
            credential_inst = Credential.init_select( # Utiliza um método de classe apenas para obter as informações necessárias para exibição
                credential_name=credential[0],
                credential_slug=credential[2],
                created_at=credential[3],
                updated_at=credential[4]
            )

            # Monta o retorno da requisição
            credential_data = {
                'credential_name': credential_inst.decrypt_data(credential_inst.credential_name, symetric_key), # Decripta o nome da credencial
                'credential_slug': credential_inst.credential_slug,
                'created_at': credential_inst.created_at,
                'updated_at': credential_inst.updated_at,
            }

            # Adiciona o dado na lista
            credential_json_list.append(credential_data)
        
        #Devolve todas as credenciais num objeto json com uma lista de cada credencial também em um objeto json
        return jsonify({'credentials': credential_json_list}), 200
    
    # Tratamento de exceções
    except Exception as e:
        return jsonify({'message': f'Erro: {str(e)}'}), 500
    
# Rota para visualizar todas as credenciais e o nível de segurança delas
@credential.route('/credential/select_all_checkup', methods=['POST'])
@jwt_required()
def select_all_checkup():

    # Recupera a chave simétrica
    data = request.get_json()
    symetric_key = data.get('symetric_key')
    jwt = data.get('jwt')

    try:
        # Recupera a identidade definida no token (email)
        identity = decode_token(jwt).get('sub')

        # Procura o usuário no banco de dados
        user_id = User.get_user_id_by_email(identity)
        if not user_id:
            return jsonify({'message': 'Usuário não encontrado.'}), 404
        
        # Busca todas as credenciais do usuário da sessão
        credential_list = Credential.get_all_credentials(identity)

        # Prepara a lista para arranjar todas as credenciais e enviar na resposta
        credential_json_list = []
        for credential in credential_list:

            credential_inst = Credential.init_select_checkup( # Utiliza um método de classe apenas para obter as informações necessárias para exibição
                credential_name=credential[0],
                credential_password=credential[1],
                credential_slug=credential[2]   
            )

            # Retorna o status de segurança da credencial e o ponto de melhoria possível se aplicável
            credential_checkup_status, credential_checkup_suggestion = credential_inst.checkup_credential(credential_inst.credential_password, symetric_key)

            # Monta o retorno da requisição
            credential_data = {
                'credential_name': credential_inst.decrypt_data(credential_inst.credential_name, symetric_key), # Decripta o nome da credencial
                'credential_password': credential_inst.decrypt_data(credential_inst.credential_password, symetric_key), # Decripta a senha da credencial
                'credential_checkup_status': credential_checkup_status,
                'credential_checkup_suggestion': credential_checkup_suggestion,
                'credential_slug': credential_inst.credential_slug
            }

            # Adiciona o dado na lista
            credential_json_list.append(credential_data)
        
        #Devolve todas as credenciais num objeto json com uma lista de cada credencial também em um objeto json
        return jsonify({'credentials': credential_json_list}), 200
    
    # Tratamento de exceções
    except Exception as e:
        return jsonify({'message': f'Erro: {str(e)}'}), 500
    
# Rota para visualizar credenciais
@credential.route('/credential/select', methods=['POST'])
@jwt_required()
def select_credential():

    # Recupera a chave simétrica
    data = request.get_json()
    symetric_key = data.get('symetric_key')
    jwt = data.get('jwt')
    credential_slug = data.get('credential_slug')

    try:
        # Recupera a identidade definida no token (email)
        identity = decode_token(jwt).get('sub')

        # Procura o usuário no banco de dados
        user_id = User.get_user_id_by_email(identity)
        if not user_id:
            return jsonify({'message': 'Usuário não encontrado.'}), 404

        # Busca a credencial e verifica a existência da mesma no banco de dados
        credential = Credential.get_credential_by_slug(credential_slug)
        if not credential:
            return jsonify({'message': 'Credencial não encontrada.'}), 404

        # Monta a resposta decriptando as informações do cofre com a chave simétrica
        credential_data = {
            'name': credential.decrypt_data(credential.credential_name, symetric_key),
            'username': credential.decrypt_data(credential.credential_username, symetric_key),
            'password': credential.decrypt_data(credential.credential_password, symetric_key),
            'domain': credential.decrypt_data(credential.credential_domain, symetric_key),
            'created_at': credential.created_at,
            'updated_at': credential.updated_at,
        }
        return jsonify({'credential': credential_data}), 200

    # Tratamento de exceções
    except Exception as e:
        return jsonify({'message': f'Erro: {str(e)}'}), 500

# Rota para atualizar de credenciais
@credential.route('/update_credential', methods=['PUT'])
@jwt_required()
def update_credential():

    # Recupera dados enviados pelo usuário e a chave simétrica
    data = request.get_json()
    name = data.get('name')
    username = data.get('username')
    password = data.get('password')
    domain = data.get('domain')
    symetric_key = data.get('symetric_key')
    jwt = data.get('jwt')
    credential_slug = data.get('credential_slug')

    try:

        # Recupera a identidade do usuário autenticado e verifica sua existência no banco de dados
        identity = decode_token(jwt).get('sub')
        user_id = User.get_user_id_by_email(identity)
        if not user_id:
            return jsonify({'message': 'Usuário não encontrado'}), 404
        
        # Busca a credencial pelo ID
        credential = Credential.get_credential_by_slug(credential_slug)
        if not credential:
            return jsonify({'message': 'Credencial não encontrada'}), 404
        
        # Verificar se a credencial pertence ao usuário autenticado
        if credential.user_id != user_id:
            return jsonify({'message': 'Não autorizado'}), 403
        
        # Atualiza apenas os campos que foram enviados com encriptação
        if name is not None:
            credential.credential_name = name
            credential.credential_name = credential.encrypt_data(credential.credential_name, symetric_key)
        if username is not None:
            credential.credential_username = username
            credential.credential_username = credential.encrypt_data(credential.credential_username, symetric_key)
        if password is not None:
            credential.credential_password = password
            credential.credential_password = credential.encrypt_data(credential.credential_password, symetric_key)
        if domain is not None:
            credential.credential_domain = domain
            credential.credential_domain = credential.encrypt_data(credential.credential_domain, symetric_key)

        db.session.commit()
        return jsonify({'message': 'Credencial atualizada com sucesso!'}), 200
    
    except Exception as e:
        return jsonify({'message': f'Erro: {str(e)}'}), 500

# Rota para deletar credencial do cofre do usuário
@credential.route('/delete_credential/<credential_slug>', methods=['DELETE'])
@jwt_required()
def delete_credential(credential_slug):

    # Recupera dados enviados pelo usuário
    data = request.get_json()
    jwt = data.get('jwt')

    # Recupera a identidade do usuário autenticado a partir do token JWT
    identity = decode_token(jwt).get('sub')
    user_id = User.get_user_id_by_email(identity)
    if not user_id:
        return jsonify({'message': 'Usuário não encontrado.'}), 404
    
    # Busca a credencial pelo ID
    credential = Credential.get_credential_by_slug(credential_slug)
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