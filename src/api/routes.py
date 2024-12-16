"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Post
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Welcome to API!"
    }

    return jsonify(response_body), 200

@api.route("/signup", methods=["POST"])
def signup():
    body = request.json

    email = body.get("email", None)
    password = body.get("password", None)

    if email is None or password is None:
        return jsonify({"error": "email and password required"}), 400
    
    #encriptar contraseña
    password_hash = generate_password_hash(password)

    print(password_hash)

    if User.query.filter_by(email=email).first() is not None:
        return jsonify({"error":"Email already taken"}), 400
    
    try:
        new_user = User(email=email, password=password_hash, is_active=True)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message":f"User with the email {new_user.email} was created successfully"}), 201

    except Exception as error:
        db.session.rollback()
        return jsonify({"error": f"{error}"}), 500

#generamos el token    
@api.route("/signin", methods=["POST"])
def signin():
    body = request.json

    email = body.get("email", None)
    password = body.get("password", None)
    print(password)

    if email is None or password is None:
        return jsonify({"error": "Email and password required"}),400
    
    user = User.query.filter_by(email=email).first()
    
    if user is None:
        return jsonify({"error": "User not found"}), 404
    
    print(user.password)
    
#validación con la password encriptada y con la que viene del body que no está encriptada
    if not check_password_hash(user.password, password):
        return jsonify({"error": "error while login in"}),400

#generamos el token    
    user_token = create_access_token({"id": user.id, "email": user.email})
    return jsonify({"token": user_token})

@api.route("/me", methods=["GET"])
@jwt_required()
def get_user_data():
    user_data = get_jwt_identity()
    return jsonify(user_data),200

@api.route("/post", methods=["POST"])
@jwt_required() #se asegura que el usuario esté autenticado y acá se obtiene el id y el email de user_token
def create_post():
    body = request.json
    user_data = get_jwt_identity() #{"id": valor, "email": valor}
    content = body.get("content", None)
    
    if content is None:
        return jsonify({"error": "Content is required"}), 400
    
    if "id" not in user_data:
        return jsonify({"error": "Invalid user data"}), 401

    try:
        new_post = Post(content=content, user_id=user_data["id"])
        db.session.add(new_post)
        db.session.commit()
        db.session.refresh(new_post)
        return jsonify({"post": new_post.serialize()}), 201

    except Exception as error:
        print("Error creating post:", error)
        return jsonify({"error": f"{error}"}), 500

@api.route("/post/me", methods=["GET"])
@jwt_required()
def get_post_from_logged_user():
    user_data = get_jwt_identity()
    user_posts = Post.query.filter_by(user_id=user_data["id"]).all()
    serialized_posts = [post.serialize() for post in user_posts]
    return jsonify({"posts":serialized_posts}),200
        