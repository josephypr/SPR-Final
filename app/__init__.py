from datetime import timedelta
from flask import Flask 
from config import config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flasgger import Swagger
from flask_marshmallow import Marshmallow

db = SQLAlchemy()
ma = Marshmallow()

def create_app(config_name):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    app.debug = True
    CORS(app)

    db.init_app(app)
    ma.init_app(app)

    Migrate(app,db) # Flask-Migrate se inicializa aquí
    jwt = JWTManager(app)
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=8) 

    api = Api(app)

    swagger_config = {
        "headers": [],
        "specs": [
            {
                "endpoint": 'apispec_1',
                "route": '/apispec_1.json',
                "rule_filter": lambda rule: True,
                "model_filter": lambda tag: True,
            }
        ],
        "static_url_path": "/flasgger_static",
        "swagger_ui": True,
        "specs_route": "/apidocs/",
        "securityDefinitions": {
            "Bearer": {
                "type": "apiKey",
                "name": "Authorization",
                "in": "header",
                "description": "Token JWT con el prefijo 'Bearer '"
            }
        },
        "swagger_ui_bundle_config": {
            "docExpansion": "none"
        }
    }
    Swagger(app, config=swagger_config)

    # Importar tus modelos y vistas (esto registra los modelos con SQLAlchemy)
    from .vistas import ( # Asegúrate de que este import sea correcto
        VistaContratista, Vista_Mensajeria, VistaLogin, VistaSignIn, VistaPrestador,
        Vista_Calificacion_Contratista, Vista_Calificacion_Prestador, VistaPortafolio,
        VistaPortafolioDetalle, VistaPostulacionDetalle, VistaCategorias,
        VistaPostulaciones, VistaPostulacionesPrestador
    )
    from .modelo import ( # Importar tus modelos para que SQLAlchemy los registre
        Usuario, Rol, Categoria, PostulacionServicio, Mensajes, Portafolio,
        Reserva, Historial, Calificacion, Estado_ser
    )


    # Rutas de la API
    api.add_resource(VistaPrestador, '/prestador/<int:cedula>')
    api.add_resource(VistaContratista, '/contratista/<int:cedula>')
    api.add_resource(VistaSignIn, '/signin')
    api.add_resource(VistaLogin, '/login')
    api.add_resource(Vista_Mensajeria, '/mensajes')
    api.add_resource(Vista_Calificacion_Contratista, '/contratista/<int:cedula>/calificaciones')
    api.add_resource(Vista_Calificacion_Prestador, '/prestador/<int:cedula>/calificaciones')
    api.add_resource(VistaPortafolioDetalle, '/portafolio/<int:id_portafolio>')
    api.add_resource(VistaPostulaciones, '/postulaciones')
    api.add_resource(VistaPostulacionDetalle, '/postulacion/<int:id_postulacion>')
    api.add_resource(VistaCategorias, '/categorias')
    api.add_resource(VistaPostulacionesPrestador, '/prestador/postulaciones')
    api.add_resource(VistaPortafolio, '/portafolio', '/portafolio/<int:cedula>')
    
    # ELIMINAR ESTE BLOQUE: Ya no es necesario si usas flask db upgrade para crear las tablas
    # with app.app_context():
    #     db.create_all()

    return app
