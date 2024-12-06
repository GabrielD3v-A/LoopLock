from flask import Blueprint, request, jsonify, make_response # type: ignore
import requests
import mysql.connector

# Criar um blueprint para agrupar as rotas principais
main_routes = Blueprint('main_routes', __name__)

mydb = mysql.connector.connect(
    host='localhost',
    user='root',
    password='',
    database='db_looplock'
)

# Rota para registro de usuários
@main_routes.route('/register_user', methods=['POST'])
def register_user():
    data = request.get_json()  # Recebe os dados enviados no corpo da requisição
    username = data.get('username')
    password = data.get('password')

    # Exemplo básico de resposta (substituir por lógica de banco e criptografia)
    if username and password:
        return jsonify(message="Usuário registrado com sucesso!", username=username), 201
    else:
        return jsonify(error="Dados inválidos!"), 400

# Rota para login de usuários
@main_routes.route('/login', methods=['POST'])
def login():
    data = request.get_json()  # Recebe os dados enviados no corpo da requisição
    username = data.get('username')
    password = data.get('password')

    # Lógica básica de autenticação
    if username == "test" and password == "1234":
        return jsonify(message="Login realizado com sucesso!", id=100), 200
    else:
        return jsonify(data), 401


@main_routes.route('/validate-recaptcha')
def validate_recaptcha(token):
    secret_key = "6LdxhJIqAAAAACz9Iu7iY0Hh6dRRFrPCctgoNKdg"
    url = "https://www.google.com/recaptcha/api/siteverify"
    data = {'secret': secret_key, 'response': token}
    response = requests.post(url, data=data)
    return response.json()


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