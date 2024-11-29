from flask import Blueprint, request, jsonify # type: ignore

# Criar um blueprint para agrupar as rotas principais
main_routes = Blueprint('main_routes', __name__)

# Rota para registro de usuários
@main_routes.route('/register', methods=['POST'])
def register():
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

    # Exemplo básico de resposta (substituir por lógica de autenticação)
    if username == "test" and password == "1234":
        return jsonify(message="Login realizado com sucesso!", username=username), 200
    else:
        return jsonify(error="Credenciais inválidas!"), 401
