from datetime import timedelta
from flask import Flask 
from config import config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api
from .modelo import db
from .vistas import VistaContratista,  Vista_Mensajeria, VistaLogin, VistaSignIn, VistaPrestador, Vista_Calificacion_Contratista, Vista_Calificacion_Prestador,  VistaPortafolio, VistaPortafolioDetalle, VistaPostulacionDetalle, VistaCategorias, VistaPostulaciones, VistaPostulacionesPrestador
from flask_jwt_extended import JWTManager
from flask_cors import CORS



def create_app(config_name):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    app.debug = True
    CORS(app)
    db.init_app(app)
    Migrate(app,db)
    JWTManager(app)
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=8)

    api = Api(app)

    #aqui van las rutas
    #api.add_resouce()
    api.add_resource(VistaPrestador, '/prestador/<int:cedula>')
    api.add_resource(VistaContratista, '/contratista/<int:cedula>')
    api.add_resource(VistaSignIn, '/signin')
    api.add_resource(VistaLogin, '/login')
    api.add_resource(Vista_Mensajeria, '/mensajes')
    api.add_resource(Vista_Calificacion_Contratista, '/contratista/<int:cedula>/calificaciones' )
    api.add_resource(Vista_Calificacion_Prestador, '/prestador/<int:cedula>/calificaciones' )
    api.add_resource(VistaPortafolioDetalle, '/portafolio/<int:id_portafolio>')
    api.add_resource(VistaPostulaciones, '/postulaciones') 
    api.add_resource(VistaPostulacionDetalle, '/postulacion/<int:id_postulacion>')
    api.add_resource(VistaCategorias, '/categorias')
    api.add_resource(VistaPostulacionesPrestador, '/prestador/postulaciones')
    api.add_resource(VistaPortafolio, '/portafolio', '/portafolio/<int:cedula>')
    
    return app