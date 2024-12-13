from configparser import Error
from flask import Blueprint, request, jsonify, make_response # type: ignore
from datetime import datetime
from models.user import User
from db.db import db
from datetime import datetime

# Criar um blueprint para agrupar as rotas principais
main_routes = Blueprint('main_routes', __name__)

# mydb = mysql.connector.connect(
#     host='localhost',
#     user='root',
#     password='',
#     database='db_looplock'
# )

# Rota para registro de usuários
@main_routes.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
   
    try:
         # Verificando se todos os campos foram fornecidos
        if not username or not email or not password:
            return jsonify({'message': 'Username, email, and password are required'}), 400
        
        existing_user = User.query.filter_by(user_email=email).first()
        if existing_user:
            return jsonify(message="E-mail já cadastrado."), 400

        # Criando um novo usuário
        new_user = User(
            user_username=username,
            user_email=email,
            user_master_password=password
        )

        # Adicionando o novo usuário ao banco de dados
        db.session.add(new_user)
        db.session.commit()

        return jsonify({'message': 'Usuário cadastrado com sucesso!'}), 201

    except Exception as e:
        db.session.rollback()  # Caso ocorra algum erro, fazemos o rollback
        return jsonify({'message': f'Erro: {str(e)}'}), 500

# Rota para login de usuários
@main_routes.route('/login', methods=['POST'])
def login():
    data = request.get_json()  # Recebe os dados enviados no corpo da requisição
    username = data.get('username')
    password = data.get('password')


    try:
        # Verificando se o usuário existe no banco
        user = User.query.filter_by(user_email=username).first()

        if user:
            stored_password = user.user_master_password  # A senha armazenada na tabela

            # Verifica se a senha fornecida corresponde à senha armazenada
            if stored_password == password:
                return jsonify(message="Login realizado com sucesso!", data=data), 200
            else:
                return jsonify(message="Campos de login inválidos!"), 401
        else:
            return jsonify(message="Usuário não encontrado!"), 404
    except Exception as e:
        return jsonify(message=f"Erro: {str(e)}"), 500


# Rota para criar credenciais
@main_routes.route('/create_credential', methods=['POST'])
def create_credential():

    # Select das informações
    credential = request.json

    # Select das informações
    my_cursor = mydb.cursor()
    sql = f"INSERT INTO credentials (name, password) VALUES ('{credential['name']}', '{credential['password']}')"
    my_cursor.execute(sql)
    mydb.commit()

    return make_response(
        jsonify(
            message='Credencial cadastrada com sucesso.',
            credential = credential
        ),
        201
    )

# Rota para deletar credenciais
@main_routes.route('/select_credential', methods=['GET'])
def select_credential():

    # Select das informações
    my_cursor = mydb.cursor()
    my_cursor.execute('SELECT * FROM credentials')
    my_credentials = my_cursor.fetchall()

    # Tratamento dos dados para retorno em JSON
    credentials = list()
    for credential in my_credentials:
        credentials.append(
            {
                'id': credential[0],
                'name': credential[1],
                'password': credential[2]
            }
        )

    # Retorno em JSON
    return make_response(
        jsonify(
            message='Lista de credenciais',
            dados = credentials  # Recebe os dados enviados no corpo da requisição
        )
    )

# Rota para atualizar de credenciais
@main_routes.route('/update_credential/<int:id>', methods=['PUT'])
def update_credential(id):
    # Obtém os dados da requisição (do corpo da requisição)
    data = request.get_json()

    # Verifica se os dados necessários foram passados
    if not data or 'name' not in data or 'password' not in data:
        return make_response(
            jsonify(
                message='Dados inválidos. É necessário fornecer nome e senha.'
            ),
            400
        )

    name = data['name']
    password = data['password']

    try:
        # Conexão com o banco de dados
        my_cursor = mydb.cursor()

        # Atualização dos dados no banco
        sql_update_query = """UPDATE credentials SET name = %s, password = %s WHERE id = %s"""
        values = (name, password, id)

        # Executa o comando SQL
        my_cursor.execute(sql_update_query, values)
        mydb.commit()  # Confirma a transação

        # Verifica se a atualização afetou alguma linha
        if my_cursor.rowcount > 0:
            return make_response(
                jsonify(
                    message=f'Credenciais atualizadas com sucesso para o ID {id}'
                ),
                200
            )
        else:
            return make_response(
                jsonify(
                    message=f'Nenhuma credencial encontrada para o ID {id}'
                ),
                404
            )
    except Exception as e:
        return make_response(
            jsonify(
                message=f'Ocorreu um erro ao atualizar a credencial: {str(e)}'
            ),
            500
        )

@main_routes.route('/delete_credential/<int:id>', methods=['DELETE'])
def delete_credential(id):
    try:
        # Conexão com o banco de dados
        my_cursor = mydb.cursor()

        # Comando SQL para deletar a credencial com o ID fornecido
        sql_delete_query = """DELETE FROM credentials WHERE id = %s"""
        my_cursor.execute(sql_delete_query, (id,))

        # Commit para confirmar a exclusão
        mydb.commit()

        # Verifica se alguma linha foi afetada (i.e., se a credencial foi encontrada e deletada)
        if my_cursor.rowcount > 0:
            return make_response(
                jsonify(
                    message=f'Credencial com ID {id} deletada com sucesso.'
                ),
                200
            )
        else:
            return make_response(
                jsonify(
                    message=f'Nenhuma credencial encontrada com o ID {id}.'
                ),
                404
            )
    except Exception as e:
        return make_response(
            jsonify(
                message=f'Ocorreu um erro ao deletar a credencial: {str(e)}'
            ),
            500
        )
