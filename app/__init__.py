from datetime import timedelta
from flask import Flask 
from config import config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flasgger import Swagger
from flask_marshmallow import Marshmallow # AÑADIDO: Importar Marshmallow

# AÑADIDO: Declarar db y ma globalmente aquí
db = SQLAlchemy()
ma = Marshmallow() # AÑADIDO: Declarar ma globalmente aquí

def create_app(config_name):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    app.debug = True
    CORS(app)

    # AÑADIDO: Inicializar db y ma con la instancia de la aplicación
    db.init_app(app)
    ma.init_app(app) # AÑADIDO: Inicializar ma con la aplicación

    Migrate(app,db)
    jwt = JWTManager(app)
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=8) # CORREGIDO: Configurar la expiración del token en app.config

    api = Api(app)

    # Configuración de Flasgger (Swagger UI)
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

    # Importar tus modelos y vistas aquí, después de que db y ma se hayan inicializado con la app
    # CORREGIDO: Quitar 'from .modelo import db' de las importaciones de arriba, ya que db se declara aquí.
    # Ahora 'db' y 'ma' se importarán desde el nivel superior del paquete 'app' en tus modelos y vistas.
    from .vistas import (
        VistaContratista, Vista_Mensajeria, VistaLogin, VistaSignIn, VistaPrestador,
        Vista_Calificacion_Contratista, Vista_Calificacion_Prestador, VistaPortafolio,
        VistaPortafolioDetalle, VistaPostulacionDetalle, VistaCategorias,
        VistaPostulaciones, VistaPostulacionesPrestador
    )
    from .modelo import ( # Importa tus modelos para que SQLAlchemy los registre
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
    
    # IMPORTANTE: Asegúrate de que db.create_all() se ejecuta en el contexto de la aplicación
    # Puedes añadirlo aquí, o si ya lo tienes en run.py, asegúrate de que run.py use app.app_context()
    # Si lo añades aquí, se ejecutará cada vez que se cree la app.
    with app.app_context():
        db.create_all()

    return app