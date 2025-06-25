import datetime
from app.modelo.modelo import PostulacionServicio
from flask_restful import Resource
from flask import request, jsonify
from ..modelo import db, Usuario, UsuarioSchema, Mensajes, MensajesSchema, Categoria, CategoriasSchema, Rol, CalificacionSchema, Calificacion, Portafolio, PortafolioSchema
from flask_jwt_extended import get_jwt_identity, jwt_required, create_access_token
from cloudinary.uploader import upload
from werkzeug.utils import secure_filename
import cloudinary.uploader

# Importar Flasgger para la documentación Swagger
from flasgger import swag_from # Se usa en las rutas para cargar la documentación desde YAML

portafolio_schema = PortafolioSchema()
portafolios_schema = PortafolioSchema(many=True)
usuario_schema = UsuarioSchema()
mensajes_schema = MensajesSchema() # Instanciar MensajesSchema
calificaciones_schema = CalificacionSchema(many=True) # Instanciar CalificacionSchema y many=True para listar

def _extract_public_id(cloudinary_url):
    """
    Extrae el public_id de una URL de Cloudinary para poder borrar la imagen.
    """
    if not cloudinary_url or 'upload/' not in cloudinary_url:
        return None
    try:
        # Encuentra la parte de la URL después de 'upload/'
        upload_index = cloudinary_url.find('upload/')
        # La siguiente parte puede tener una versión (ej. v123456/) o no
        if 'v' in cloudinary_url[upload_index+7:] and cloudinary_url[upload_index+7].isdigit():
            public_id_start_index = cloudinary_url.find('/', upload_index + 7) + 1
        else:
            public_id_start_index = upload_index + len('upload/')
        
        public_id_end_index = cloudinary_url.rfind('.')
        return cloudinary_url[public_id_start_index:public_id_end_index]
    except Exception as e:
        print(f"Error extrayendo public_id: {e}")
        return None


class VistaContratista(Resource):
    @jwt_required()
    @swag_from({
        'tags': ['Contratistas'],
        'security': [{'Bearer': []}],
        'parameters': [
            {
                'name': 'cedula',
                'in': 'path',
                'type': 'string',
                'required': True,
                'description': 'Cédula del contratista.'
            }
        ],
        'responses': {
            '200': {
                'description': 'Datos del contratista.',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'cedula': {'type': 'string'},
                        'nombres': {'type': 'string'},
                        'apellidos': {'type': 'string'},
                        'celular': {'type': 'string'},
                        'direccion': {'type': 'string'},
                        'correo': {'type': 'string'},
                        'fecha_nacimiento': {'type': 'string', 'format': 'date'},
                        'foto': {'type': 'string', 'format': 'url'}
                    }
                }
            },
            '404': {
                'description': 'Contratista no encontrado.'
            }
        }
    })
    def get(self, cedula):
        contratista = Usuario.query.get_or_404(cedula)
        fecha_nacimiento_str = contratista.fecha_nacimiento.strftime('%Y-%m-%d') if contratista.fecha_nacimiento else None
        return {
            "cedula": contratista.cedula,
            "nombres": contratista.nombres,
            "apellidos": contratista.apellidos,
            "celular": contratista.celular,
            "direccion": contratista.direccion,
            "correo": contratista.correo,
            "fecha_nacimiento": fecha_nacimiento_str,
            "foto": contratista.foto
        }, 200

    @jwt_required()
    @swag_from({
        'tags': ['Contratistas'],
        'security': [{'Bearer': []}],
        'parameters': [
            {
                'name': 'cedula',
                'in': 'path',
                'type': 'string',
                'required': True,
                'description': 'Cédula del contratista a actualizar.'
            },
            {
                'name': 'body',
                'in': 'body',
                'required': True,
                'schema': {
                    'type': 'object',
                    'properties': {
                        'nombres': {'type': 'string', 'description': 'Nombres del contratista.'},
                        'apellidos': {'type': 'string', 'description': 'Apellidos del contratista.'},
                        'correo': {'type': 'string', 'format': 'email', 'description': 'Correo electrónico del contratista.'},
                        'celular': {'type': 'string', 'description': 'Número de celular del contratista.'},
                        'direccion': {'type': 'string', 'description': 'Dirección de residencia del contratista.'},
                        'fecha_nacimiento': {'type': 'string', 'format': 'date', 'description': 'Fecha de nacimiento (YYYY-MM-DD).'},
                        'foto': {'type': 'string', 'format': 'url', 'description': 'URL de la foto de perfil del contratista.'}
                    }
                },
                'examples': {
                    'aplicar_cambios': {
                        'nombres': 'Nuevo Nombre',
                        'celular': '3001234567'
                    }
                }
            }
        ],
        'responses': {
            '200': {
                'description': 'Perfil actualizado correctamente.'
            },
            '403': {
                'description': 'No autorizado para modificar este perfil.'
            },
            '404': {
                'description': 'Contratista no encontrado.'
            }
        }
    })
    def put(self, cedula):
        current_user_cedula = get_jwt_identity()
        if str(cedula) != current_user_cedula:
            return {'mensaje': 'No autorizado para modificar este perfil'}, 403

        contratista = Usuario.query.get_or_404(cedula)
        data = request.get_json()

        old_foto_url = contratista.foto
        
        contratista.nombres = data.get("nombres", contratista.nombres)
        contratista.apellidos = data.get("apellidos", contratista.apellidos)
        contratista.correo = data.get("correo", contratista.correo)
        contratista.celular = data.get("celular", contratista.celular)
        contratista.direccion = data.get("direccion", contratista.direccion)
        if data.get('fecha_nacimiento'):
            contratista.fecha_nacimiento = datetime.datetime.strptime(data['fecha_nacimiento'], '%Y-%m-%d').date()

        if 'foto' in data and data['foto'] != old_foto_url:
            contratista.foto = data['foto']
            if old_foto_url:
                old_public_id = _extract_public_id(old_foto_url)
                if old_public_id:
                    try:
                        cloudinary.uploader.destroy(old_public_id)
                        print(f"Imagen antigua {old_public_id} eliminada de Cloudinary.")
                    except Exception as e:
                        print(f"Error al eliminar imagen antigua de Cloudinary: {e}")

        db.session.commit()
        return {"mensaje": "Perfil actualizado correctamente"}, 200

    @jwt_required()
    @swag_from({
        'tags': ['Contratistas'],
        'security': [{'Bearer': []}],
        'parameters': [
            {
                'name': 'cedula',
                'in': 'path',
                'type': 'string',
                'required': True,
                'description': 'Cédula del contratista a eliminar.'
            }
        ],
        'responses': {
            '200': {
                'description': 'Perfil de contratista eliminado correctamente.'
            },
            '403': {
                'description': 'No autorizado para eliminar este perfil.'
            },
            '404': {
                'description': 'Contratista no encontrado.'
            }
        }
    })
    def delete(self, cedula):
        current_user_cedula = get_jwt_identity()
        if str(cedula) != current_user_cedula:
            return {'mensaje': 'No autorizado para eliminar este perfil'}, 403

        contratista = Usuario.query.get_or_404(cedula)
        
        if contratista.foto:
            public_id_to_delete = _extract_public_id(contratista.foto)
            if public_id_to_delete:
                try:
                    cloudinary.uploader.destroy(public_id_to_delete)
                    print(f"Foto de perfil {public_id_to_delete} eliminada de Cloudinary.")
                except Exception as e:
                    print(f"Error al eliminar foto de Cloudinary: {e}")

        db.session.delete(contratista)
        db.session.commit()
        return {"mensaje": "Perfil de contratista eliminado correctamente"}, 200


class VistaPrestador(Resource):
    @jwt_required()
    @swag_from({
        'tags': ['Prestadores'],
        'security': [{'Bearer': []}],
        'parameters': [
            {
                'name': 'cedula',
                'in': 'path',
                'type': 'string',
                'required': True,
                'description': 'Cédula del prestador.'
            }
        ],
        'responses': {
            '200': {
                'description': 'Datos del prestador.',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'cedula': {'type': 'string'},
                        'nombres': {'type': 'string'},
                        'apellidos': {'type': 'string'},
                        'celular': {'type': 'string'},
                        'direccion': {'type': 'string'},
                        'titulos_uni': {'type': 'string'},
                        'descripcion': {'type': 'string'},
                        'correo': {'type': 'string'},
                        'fecha_nacimiento': {'type': 'string', 'format': 'date'},
                        'foto': {'type': 'string', 'format': 'url'}
                    }
                }
            },
            '404': {
                'description': 'Prestador no encontrado.'
            }
        }
    })
    def get(self, cedula):
        prestador = Usuario.query.get_or_404(cedula)
        fecha_nacimiento_str = prestador.fecha_nacimiento.strftime('%Y-%m-%d') if prestador.fecha_nacimiento else None
        return {
            "cedula": prestador.cedula,
            "nombres": prestador.nombres,
            "apellidos": prestador.apellidos,
            "celular": prestador.celular,
            "direccion": prestador.direccion,
            "titulos_uni": prestador.titulos_uni,
            "descripcion": prestador.descripcion,
            "correo": prestador.correo,
            "fecha_nacimiento": fecha_nacimiento_str,
            "foto": prestador.foto
        }, 200

    @jwt_required()
    @swag_from({
        'tags': ['Prestadores'],
        'security': [{'Bearer': []}],
        'parameters': [
            {
                'name': 'cedula',
                'in': 'path',
                'type': 'string',
                'required': True,
                'description': 'Cédula del prestador a actualizar.'
            },
            {
                'name': 'body',
                'in': 'body',
                'required': True,
                'schema': {
                    'type': 'object',
                    'properties': {
                        'nombres': {'type': 'string', 'description': 'Nombres del prestador.'},
                        'apellidos': {'type': 'string', 'description': 'Apellidos del prestador.'},
                        'correo': {'type': 'string', 'format': 'email', 'description': 'Correo electrónico del prestador.'},
                        'celular': {'type': 'string', 'description': 'Número de celular del prestador.'},
                        'direccion': {'type': 'string', 'description': 'Dirección de residencia del prestador.'},
                        'fecha_nacimiento': {'type': 'string', 'format': 'date', 'description': 'Fecha de nacimiento (YYYY-MM-DD).'},
                        'titulos_uni': {'type': 'string', 'description': 'Títulos universitarios del prestador.'},
                        'descripcion': {'type': 'string', 'description': 'Descripción profesional del prestador.'},
                        'foto': {'type': 'string', 'format': 'url', 'description': 'URL de la foto de perfil del prestador.'}
                    }
                },
                'examples': {
                    'aplicar_cambios': {
                        'descripcion': 'Experto en desarrollo web con 5 años de experiencia.',
                        'titulos_uni': 'Ingeniero de Sistemas'
                    }
                }
            }
        ],
        'responses': {
            '200': {
                'description': 'Perfil actualizado correctamente.'
            },
            '403': {
                'description': 'No autorizado para modificar este perfil.'
            },
            '404': {
                'description': 'Prestador no encontrado.'
            }
        }
    })
    def put(self, cedula):
        current_user_cedula = get_jwt_identity()
        if str(cedula) != current_user_cedula:
            return {'mensaje': 'No autorizado para modificar este perfil'}, 403

        prestador = Usuario.query.get_or_404(cedula)
        data = request.get_json()

        old_foto_url = prestador.foto
        
        prestador.nombres = data.get("nombres", prestador.nombres)
        prestador.apellidos = data.get("apellidos", prestador.apellidos)
        prestador.correo = data.get("correo", prestador.correo)
        prestador.celular = data.get("celular", prestador.celular)
        prestador.direccion = data.get("direccion", prestador.direccion)
        if data.get('fecha_nacimiento'):
            prestador.fecha_nacimiento = datetime.datetime.strptime(data['fecha_nacimiento'], '%Y-%m-%d').date()
        
        prestador.titulos_uni = data.get("titulos_uni", prestador.titulos_uni)
        prestador.descripcion = data.get("descripcion", prestador.descripcion)

        if 'foto' in data and data['foto'] != old_foto_url:
            prestador.foto = data['foto']
            if old_foto_url:
                old_public_id = _extract_public_id(old_foto_url)
                if old_public_id:
                    try:
                        cloudinary.uploader.destroy(old_public_id)
                        print(f"Imagen antigua {old_public_id} eliminada de Cloudinary.")
                    except Exception as e:
                        print(f"Error al eliminar imagen antigua de Cloudinary: {e}")

        db.session.commit()
        return {"mensaje": "Perfil actualizado correctamente"}, 200

    @jwt_required()
    @swag_from({
        'tags': ['Prestadores'],
        'security': [{'Bearer': []}],
        'parameters': [
            {
                'name': 'cedula',
                'in': 'path',
                'type': 'string',
                'required': True,
                'description': 'Cédula del prestador a eliminar.'
            }
        ],
        'responses': {
            '200': {
                'description': 'Perfil de prestador eliminado correctamente.'
            },
            '403': {
                'description': 'No autorizado para eliminar este perfil.'
            },
            '404': {
                'description': 'Prestador no encontrado.'
            }
        }
    })
    def delete(self, cedula):
        current_user_cedula = get_jwt_identity()
        if str(cedula) != current_user_cedula:
            return {'mensaje': 'No autorizado para eliminar este perfil'}, 403

        prestador = Usuario.query.get_or_404(cedula)
        
        if prestador.foto:
            public_id_to_delete = _extract_public_id(prestador.foto)
            if public_id_to_delete:
                try:
                    cloudinary.uploader.destroy(public_id_to_delete)
                    print(f"Foto de perfil {public_id_to_delete} eliminada de Cloudinary.")
                except Exception as e:
                    print(f"Error al eliminar foto de Cloudinary: {e}")

        db.session.delete(prestador)
        db.session.commit()
        return {"mensaje": "Perfil de prestador eliminado correctamente"}, 200


class VistaSignIn(Resource):
    @swag_from({
        'tags': ['Autenticación'],
        'description': 'Registra un nuevo usuario (contratista o prestador).',
        'parameters': [
            {
                'name': 'cedula',
                'in': 'formData',
                'type': 'string',
                'required': True,
                'description': 'Cédula del usuario.'
            },
            {
                'name': 'nombres',
                'in': 'formData',
                'type': 'string',
                'required': True,
                'description': 'Nombres del usuario.'
            },
            {
                'name': 'apellidos',
                'in': 'formData',
                'type': 'string',
                'required': True,
                'description': 'Apellidos del usuario.'
            },
            {
                'name': 'celular',
                'in': 'formData',
                'type': 'string',
                'required': True,
                'description': 'Número de celular del usuario.'
            },
            {
                'name': 'direccion',
                'in': 'formData',
                'type': 'string',
                'required': True,
                'description': 'Dirección de residencia del usuario.'
            },
            {
                'name': 'contrasena',
                'in': 'formData',
                'type': 'string',
                'required': True,
                'description': 'Contraseña del usuario.'
            },
            {
                'name': 'correo',
                'in': 'formData',
                'type': 'string',
                'required': True,
                'description': 'Correo electrónico del usuario.'
            },
            {
                'name': 'fecha_nacimiento',
                'in': 'formData',
                'type': 'string',
                'format': 'date',
                'required': True,
                'description': 'Fecha de nacimiento (YYYY-MM-DD).'
            },
            {
                'name': 'id_rol',
                'in': 'formData',
                'type': 'integer',
                'required': True,
                'description': 'ID del rol del usuario (ej. 1 para contratista, 2 para prestador).'
            },
            {
                'name': 'titulos_uni',
                'in': 'formData',
                'type': 'string',
                'required': False,
                'description': 'Títulos universitarios del usuario (solo para prestadores).'
            },
            {
                'name': 'descripcion',
                'in': 'formData',
                'type': 'string',
                'required': False,
                'description': 'Descripción profesional del usuario (solo para prestadores).'
            },
            {
                'name': 'foto',
                'in': 'formData',
                'type': 'file',
                'required': False,
                'description': 'Foto de perfil del usuario.'
            },
            {
                'name': 'categoria',
                'in': 'formData',
                'type': 'array',
                'items': {'type': 'string'},
                'collectionFormat': 'multi',
                'required': False,
                'description': 'Lista de categorías/servicios a asociar (ej. categoria=Hogar:Electricidad, categoria=Hogar:Fontanería). Solo para prestadores.'
            }
        ],
        'responses': {
            '201': {
                'description': 'Usuario registrado exitosamente.'
            },
            '400': {
                'description': 'Datos incompletos o formato de categoría inválido.'
            },
            '404': {
                'description': 'Rol o categoría/servicio no encontrado.'
            }
        }
    })
    def post(self):
        archivo = request.files.get('foto')
        url_imagen = None
        if archivo:
            resultado = cloudinary.uploader.upload(archivo)
            url_imagen = resultado.get('secure_url')
        
        id_rol = request.form.get('id_rol')
        if not id_rol:
            return {'mensaje': 'El rol es obligatorio'}, 400
        
        rol = Rol.query.filter_by(id_rol=id_rol).first()
        if not rol:
            return {'mensaje': f'El rol con id {id_rol} no existe'}, 404
        
        nuevo_usuario = Usuario(
            cedula=request.form['cedula'],
            nombres=request.form['nombres'],
            apellidos=request.form['apellidos'],
            celular=request.form['celular'],
            direccion=request.form['direccion'],
            contrasena=request.form['contrasena'],
            titulos_uni=request.form.get('titulos_uni'),
            descripcion=request.form.get('descripcion'),
            correo=request.form['correo'],
            fecha_nacimiento=request.form['fecha_nacimiento'],
            foto=url_imagen
        )
        
        nuevo_usuario.rol_id = rol.id_rol
        
        categorias_datos = request.form.getlist('categoria')
        asociar_categorias = []
        for dato in categorias_datos:
            try:
                nombre_categoria, nombre_servicio = dato.split(":")
            except ValueError:
                return {'mensaje': 'Formato de categoría inválido'}, 400
            categoria = Categoria.query.filter_by(
                nombre_categoria=nombre_categoria,
                nombre_servicio=nombre_servicio
            ).first()
            if not categoria:
                return {'mensaje': f'No existe la categoría/servicio {dato}'}, 404
            asociar_categorias.append(categoria)
        
        nuevo_usuario.categorias.extend(asociar_categorias)
        
        db.session.add(nuevo_usuario)
        db.session.commit()

        return usuario_schema.dump(nuevo_usuario), 201


class VistaLogin(Resource):
    @swag_from({
        'tags': ['Autenticación'],
        'description': 'Inicia sesión de un usuario y devuelve un token JWT.',
        'parameters': [
            {
                'name': 'body',
                'in': 'body',
                'required': True,
                'schema': {
                    'type': 'object',
                    'required': ['correo', 'contrasena', 'rol'],
                    'properties': {
                        'correo': {'type': 'string', 'format': 'email', 'description': 'Correo electrónico del usuario.'},
                        'contrasena': {'type': 'string', 'description': 'Contraseña del usuario.'},
                        'rol': {'type': 'integer', 'description': 'ID del rol del usuario (ej. 1 para contratista, 2 para prestador).'}
                    }
                },
                'examples': {
                    'credenciales': {
                        'correo': 'usuario@example.com',
                        'contrasena': 'micontrasena',
                        'rol': 1
                    }
                }
            }
        ],
        'responses': {
            '200': {
                'description': 'Inicio de sesión exitoso.',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'mensaje': {'type': 'string'},
                        'token_de_acceso': {'type': 'string'},
                        'rol': {'type': 'integer'}
                    }
                }
            },
            '400': {
                'description': 'Correo, contraseña o rol no enviados.'
            },
            '401': {
                'description': 'Correo no registrado o contraseña incorrecta.'
            },
            '403': {
                'description': 'Rol incorrecto.'
            }
        }
    })
    def post(self):
        datos = request.get_json()
        u_correo = datos.get("correo")
        u_contrasena = datos.get("contrasena")
        rol_id = datos.get("rol")

        if not all([u_correo, u_contrasena, rol_id]):
            return {'mensaje': 'Correo, contraseña o rol no enviados'}, 400

        usuario = Usuario.query.filter_by(correo=u_correo).first()

        if not usuario:
            return {'mensaje': 'Correo no registrado'}, 401

        if not usuario.verificar_contrasena(u_contrasena):
            return {'mensaje': 'Contraseña incorrecta'}, 401

        if usuario.rol_id != rol_id:
            return {
                'mensaje': f'Rol incorrecto. El usuario está registrado como rol ID {usuario.rol_id}.'
            }, 403

        token_de_acceso = create_access_token(identity=str(usuario.cedula))
        return {
            'mensaje': 'Inicio de sesión exitoso',
            'token_de_acceso': token_de_acceso,
            'rol': usuario.rol_id
        }, 200


class VistaPostulaciones(Resource):
    @jwt_required()
    @swag_from({
        'tags': ['Postulaciones'],
        'security': [{'Bearer': []}],
        'parameters': [
            {
                'name': 'categoria_id',
                'in': 'query',
                'type': 'integer',
                'required': False,
                'description': 'ID de la categoría para filtrar las postulaciones.'
            }
        ],
        'responses': {
            '200': {
                'description': 'Lista de postulaciones (posiblemente filtradas por categoría).',
                'schema': {
                    'type': 'array',
                    'items': {
                        'type': 'object',
                        'properties': {
                            'id_postulacion': {'type': 'integer'},
                            'descripcion': {'type': 'string'},
                            'whatsapp': {'type': 'string'},
                            'fecha_postulacion': {'type': 'string', 'format': 'date-time'},
                            'prestador': {
                                'type': 'object',
                                'properties': {
                                    'cedula': {'type': 'string'},
                                    'nombres': {'type': 'string'},
                                    'apellidos': {'type': 'string'},
                                    'foto': {'type': 'string', 'format': 'url'}
                                }
                            },
                            'categoria': {
                                'type': 'object',
                                'properties': {
                                    'id_categoria': {'type': 'integer'},
                                    'nombre_categoria': {'type': 'string'},
                                    'nombre_servicio': {'type': 'string'}
                                }
                            }
                        }
                    }
                }
            },
            '404': {
                'description': 'No hay postulaciones para este servicio.'
            },
            '500': {
                'description': 'Error interno del servidor.'
            }
        }
    })
    def get(self):
        """
        Devuelve una lista de todas las postulaciones.
        OPCIONAL: Si se pasa un 'categoria_id' como parámetro en la URL,
        filtra las postulaciones para esa categoría específica.
        Ejemplo de llamada desde el frontend: /postulaciones?categoria_id=1
        """
        try:
            query = PostulacionServicio.query

            categoria_id_filtro = request.args.get('categoria_id', type=int)
            if categoria_id_filtro:
                query = query.filter_by(categoria_id=categoria_id_filtro)

            postulaciones = query.order_by(PostulacionServicio.fecha_postulacion.desc()).all()
            
            if not postulaciones:
                return {"mensaje": "No hay postulaciones para este servicio."}, 404

            resultado = []
            for p in postulaciones:
                resultado.append({
                    "id_postulacion": p.id_postulacion,
                    "descripcion": p.descripcion,
                    "whatsapp": p.whatsapp,
                    "fecha_postulacion": p.fecha_postulacion.strftime('%Y-%m-%d %H:%M:%S'),
                    "prestador": { "cedula": p.prestador.cedula, "nombres": p.prestador.nombres, "apellidos": p.prestador.apellidos, "foto": p.prestador.foto },
                    "categoria": { "id_categoria": p.categoria.id_categoria, "nombre_categoria": p.categoria.nombre_categoria, "nombre_servicio": p.categoria.nombre_servicio }
                })
            return jsonify(resultado)
        except Exception as e:
            return {"mensaje": f"Error interno del servidor: {str(e)}"}, 500

    @jwt_required()
    @swag_from({
        'tags': ['Postulaciones'],
        'security': [{'Bearer': []}],
        'parameters': [
            {
                'name': 'body',
                'in': 'body',
                'required': True,
                'schema': {
                    'type': 'object',
                    'required': ['descripcion', 'categoria_id'],
                    'properties': {
                        'descripcion': {'type': 'string', 'description': 'Descripción de la postulación del servicio.'},
                        'categoria_id': {'type': 'integer', 'description': 'ID de la categoría del servicio postulado.'}
                    }
                },
                'examples': {
                    'nueva_postulacion': {
                        'descripcion': 'Ofrezco servicios de fontanería para emergencias 24/7.',
                        'categoria_id': 1
                    }
                }
            }
        ],
        'responses': {
            '201': {
                'description': 'Postulación guardada exitosamente.',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'mensaje': {'type': 'string'},
                        'id_postulacion': {'type': 'integer'}
                    }
                }
            },
            '400': {
                'description': 'La descripción y el ID de la categoría son obligatorios.'
            },
            '403': {
                'description': 'Acción no permitida para este rol (solo prestadores pueden postular).'
            },
            '404': {
                'description': 'Usuario no encontrado.'
            },
            '500': {
                'description': 'Error al guardar postulación.'
            }
        }
    })
    def post(self):
        try:
            cedula_usuario = get_jwt_identity()
            usuario = Usuario.query.get(cedula_usuario)
            if not usuario:
                return {'mensaje': 'Usuario no encontrado'}, 404
            if usuario.rol_id != 2: # Asumiendo que 2 es el id_rol de Prestador
                return {'mensaje': 'Acción no permitida para este rol.'}, 403

            data = request.get_json()
            descripcion = data.get("descripcion")
            categoria_id = data.get("categoria_id")
            
            if not descripcion or not categoria_id:
                return {'mensaje': 'La descripción y el ID de la categoría son obligatorios'}, 400

            nueva_postulacion = PostulacionServicio(
                descripcion=descripcion, whatsapp=usuario.celular,
                usuario_cedula=cedula_usuario, categoria_id=categoria_id
            )
            db.session.add(nueva_postulacion)
            db.session.commit()
            return {"mensaje": "Postulación guardada exitosamente", "id_postulacion": nueva_postulacion.id_postulacion}, 201
        except Exception as e:
            db.session.rollback()
            return {"mensaje": f"Error al guardar postulación: {str(e)}"}, 500


class VistaPostulacionesPrestador(Resource):
    @jwt_required()
    @swag_from({
        'tags': ['Postulaciones'],
        'security': [{'Bearer': []}],
        'description': 'Devuelve una lista con los detalles completos de todas las postulaciones del prestador logueado.',
        'responses': {
            '200': {
                'description': 'Lista de postulaciones del prestador logueado.',
                'schema': {
                    'type': 'array',
                    'items': {
                        'type': 'object',
                        'properties': {
                            'id_postulacion': {'type': 'integer'},
                            'descripcion': {'type': 'string'},
                            'fecha_postulacion': {'type': 'string', 'format': 'date'},
                            'categoria': {
                                'type': 'object',
                                'properties': {
                                    'id_categoria': {'type': 'integer'},
                                    'nombre_servicio': {'type': 'string'}
                                }
                            }
                        }
                    }
                }
            },
            '500': {
                'description': 'Error al obtener las postulaciones.'
            }
        }
    })
    def get(self):
        """
        Devuelve una lista con los detalles completos de todas las 
        postulaciones del prestador logueado.
        """
        try:
            cedula_prestador = get_jwt_identity()
            postulaciones = PostulacionServicio.query.filter_by(usuario_cedula=cedula_prestador).order_by(PostulacionServicio.fecha_postulacion.desc()).all()
            
            resultado = []
            for p in postulaciones:
                resultado.append({
                    "id_postulacion": p.id_postulacion,
                    "descripcion": p.descripcion, # La descripción específica de esa postulación
                    "fecha_postulacion": p.fecha_postulacion.strftime('%Y-%m-%d'),
                    "categoria": {
                        "id_categoria": p.categoria.id_categoria,
                        "nombre_servicio": p.categoria.nombre_servicio
                    }
                })
            
            return jsonify(resultado)

        except Exception as e:
            return {"mensaje": f"Error al obtener las postulaciones: {str(e)}"}, 500


class VistaPostulacionDetalle(Resource):
    @jwt_required()
    @swag_from({
        'tags': ['Postulaciones'],
        'security': [{'Bearer': []}],
        'parameters': [
            {
                'name': 'id_postulacion',
                'in': 'path',
                'type': 'integer',
                'required': True,
                'description': 'ID de la postulación a eliminar.'
            }
        ],
        'responses': {
            '200': {
                'description': 'Postulación eliminada correctamente.'
            },
            '403': {
                'description': 'No tiene permiso para eliminar esta postulación.'
            },
            '404': {
                'description': 'Postulación no encontrada.'
            },
            '500': {
                'description': 'Error al eliminar la postulación.'
            }
        }
    })
    def delete(self, id_postulacion):
        try:
            cedula_usuario = get_jwt_identity()
            postulacion = PostulacionServicio.query.get_or_404(id_postulacion)

            if str(postulacion.usuario_cedula) != cedula_usuario:
                return {'mensaje': 'No tiene permiso para eliminar esta postulación'}, 403

            db.session.delete(postulacion)
            db.session.commit()
            
            return {'mensaje': 'Postulación eliminada correctamente'}, 200

        except Exception as e:
            db.session.rollback()
            return {'mensaje': f'Error al eliminar la postulación: {str(e)}'}, 500
    
    # NOTA: Este método GET está duplicado de VistaPortafolio.get. 
    # En una aplicación real, se debería resolver esta duplicidad.
    @jwt_required()
    @swag_from({
        'tags': ['Portafolios'], # Etiquetado como Portafolios porque su función real es esa
        'security': [{'Bearer': []}],
        'parameters': [
            {
                'name': 'cedula',
                'in': 'path',
                'type': 'string',
                'required': False, # Opcional si se obtiene del token
                'description': 'Cédula del usuario para obtener su portafolio. Si no se provee, se usa la cédula del usuario logueado.'
            }
        ],
        'responses': {
            '200': {
                'description': 'Lista de ítems del portafolio del usuario.',
                'schema': {
                    'type': 'array',
                    'items': {
                        'type': 'object',
                        'properties': {
                            'id_portafolio': {'type': 'integer'},
                            'descripcion': {'type': 'string'},
                            'imagenes': {'type': 'string', 'format': 'url'},
                            'usuario_cedula': {'type': 'string'}
                        }
                    }
                }
            },
            '400': {
                'description': 'No se especificó un usuario.'
            },
            '500': {
                'description': 'Error al obtener portafolios.'
            }
        }
    })
    def get(self, cedula=None):
        """
        Si se provee una cédula, devuelve el portafolio público de ese usuario.
        Si no se provee una cédula, devuelve el portafolio del usuario logueado.
        """
        try:
            target_cedula = None
            if cedula:
                target_cedula = cedula
            else:
                target_cedula = get_jwt_identity()

            if not target_cedula:
                return {'mensaje': 'No se especificó un usuario'}, 400

            portafolios = Portafolio.query.filter_by(usuario_cedula=target_cedula).all()
            
            return portafolios_schema.dump(portafolios), 200
        
        except Exception as e:
            return {'mensaje': f'Error al obtener portafolios: {str(e)}'}, 500


class VistaCategorias(Resource):
    @jwt_required()
    @swag_from({
        'tags': ['Categorías'],
        'security': [{'Bearer': []}],
        'description': 'Devuelve una lista de todas las categorías disponibles.',
        'responses': {
            '200': {
                'description': 'Lista de categorías.',
                'schema': {
                    'type': 'array',
                    'items': {
                        'type': 'object',
                        'properties': {
                            'id_categoria': {'type': 'integer'},
                            'nombre_categoria': {'type': 'string'},
                            'nombre_servicio': {'type': 'string'}
                        }
                    }
                }
            },
            '404': {
                'description': 'No hay categorías disponibles.'
            },
            '500': {
                'description': 'Error interno del servidor al cargar categorías.'
            }
        }
    })
    def get(self):
        try:
            categorias = Categoria.query.all()
            if not categorias:
                return {"mensaje": "No hay categorías disponibles"}, 404
            
            lista_categorias = []
            for cat in categorias:
                lista_categorias.append({
                    "id_categoria": cat.id_categoria,
                    "nombre_categoria": cat.nombre_categoria,
                    "nombre_servicio": cat.nombre_servicio,
                })
            return jsonify(lista_categorias)
        except Exception as e:
            db.session.rollback()
            return {"mensaje": f"Error interno del servidor al cargar categorías: {str(e)}"}, 500


class Vista_Mensajeria(Resource):
    @swag_from({
        'tags': ['Mensajes'],
        'description': 'Devuelve una lista de todos los mensajes.',
        'responses': {
            '200': {
                'description': 'Lista de mensajes.',
                'schema': {
                    'type': 'array',
                    'items': {
                        'type': 'object', # Ajustar al esquema real de Mensajes
                        'properties': {
                            'id': {'type': 'integer'},
                            'mensajes': {'type': 'string'}
                        }
                    }
                }
            }
        }
    })
    def get(self):
        # Asumiendo que mensajes_schema está configurado para serializar una lista de mensajes.
        # Si MensajesSchema es para un solo mensaje, necesitarás otro esquema para la lista o usar dump(many=True).
        # Aquí se asume que mensajes_schema ya puede manejar una lista debido a que el código original usa dump() directamente.
        return mensajes_schema.dump(Mensajes.query.all(), many=True), 200 # Asegurar many=True

    @jwt_required()
    @swag_from({
        'tags': ['Mensajes'],
        'security': [{'Bearer': []}],
        'description': 'Crea un nuevo mensaje.',
        'parameters': [
            {
                'name': 'body',
                'in': 'body',
                'required': True,
                'schema': {
                    'type': 'object',
                    'required': ['mensajes'],
                    'properties': {
                        'mensajes': {'type': 'string', 'description': 'Contenido del mensaje.'}
                    }
                },
                'examples': {
                    'nuevo_mensaje': {
                        'mensajes': 'Hola, necesito un servicio de plomería urgente.'
                    }
                }
            }
        ],
        'responses': {
            '201': {
                'description': 'Mensaje creado exitosamente.',
                'schema': {
                    'type': 'object', # Ajustar al esquema real de Mensajes
                    'properties': {
                        'id': {'type': 'integer'},
                        'mensajes': {'type': 'string'}
                    }
                }
            }
        }
    })
    def post(self):
        nuevo_mensaje = Mensajes(mensajes=request.json['mensajes'])
        db.session.add(nuevo_mensaje)
        db.session.commit()
        return mensajes_schema.dump(nuevo_mensaje), 201
    
class Vista_Calificacion_Contratista(Resource):
    #ruta publica
    @swag_from({
        'tags': ['Calificaciones'],
        'description': 'Obtiene las calificaciones para un contratista específico.',
        'parameters': [
            {
                'name': 'cedula',
                'in': 'path',
                'type': 'string',
                'required': True,
                'description': 'Cédula del contratista.'
            }
        ],
        'responses': {
            '200': {
                'description': 'Lista de calificaciones del contratista.',
                'schema': {
                    'type': 'array',
                    'items': {
                        'type': 'object', # Ajustar al esquema real de Calificacion
                        'properties': {
                            'id_calificacion': {'type': 'integer'},
                            'puntuacion': {'type': 'number'},
                            'comentario': {'type': 'string'},
                            'cedula': {'type': 'string'} # Cédula del contratista/prestador calificado
                        }
                    }
                }
            }
        }
    })
    def get(self, cedula):
        calificaciones = Calificacion.query.filter_by(cedula = cedula).all()
        return calificaciones_schema.dump(calificaciones), 200
    
class Vista_Calificacion_Prestador(Resource):
    #ruta publica
    @swag_from({
        'tags': ['Calificaciones'],
        'description': 'Obtiene las calificaciones para un prestador específico.',
        'parameters': [
            {
                'name': 'cedula',
                'in': 'path',
                'type': 'string',
                'required': True,
                'description': 'Cédula del prestador.'
            }
        ],
        'responses': {
            '200': {
                'description': 'Lista de calificaciones del prestador.',
                'schema': {
                    'type': 'array',
                    'items': {
                        'type': 'object', # Ajustar al esquema real de Calificacion
                        'properties': {
                            'id_calificacion': {'type': 'integer'},
                            'puntuacion': {'type': 'number'},
                            'comentario': {'type': 'string'},
                            'cedula': {'type': 'string'} # Cédula del contratista/prestador calificado
                        }
                    }
                }
            }
        }
    })
    def get(self, cedula):
        calificaciones = Calificacion.query.filter_by(cedula = cedula).all()
        return calificaciones_schema.dump(calificaciones), 200
    
# En tu archivo de vistas (vistas.py)

class VistaPortafolio(Resource):
    @jwt_required()
    @swag_from({
        'tags': ['Portafolios'],
        'security': [{'Bearer': []}],
        'parameters': [
            {
                'name': 'cedula',
                'in': 'path',
                'type': 'string',
                'required': False,
                'description': 'Cédula del usuario para obtener su portafolio. Si no se provee, se usa la cédula del usuario logueado.'
            }
        ],
        'responses': {
            '200': {
                'description': 'Lista de ítems del portafolio del usuario.',
                'schema': {
                    'type': 'array',
                    'items': {
                        'type': 'object',
                        'properties': {
                            'id_portafolio': {'type': 'integer'},
                            'descripcion': {'type': 'string'},
                            'imagenes': {'type': 'string', 'format': 'url'},
                            'usuario_cedula': {'type': 'string'}
                        }
                    }
                }
            },
            '400': {
                'description': 'No se especificó un usuario.'
            },
            '500': {
                'description': 'Error al obtener portafolios.'
            }
        }
    })
    def get(self, cedula=None):
        """
        Si se provee una cédula en la URL, devuelve el portafolio de ese usuario.
        Si no, devuelve el portafolio del usuario que está logueado.
        """
        try:
            target_cedula = cedula if cedula else get_jwt_identity()

            if not target_cedula:
                return {'mensaje': 'No se especificó un usuario'}, 400

            portafolios = Portafolio.query.filter_by(usuario_cedula=target_cedula).all()
            return portafolios_schema.dump(portafolios), 200 
        
        except Exception as e:
            return {'mensaje': f'Error al obtener portafolios: {str(e)}'}, 500
        
    @jwt_required()
    @swag_from({
        'tags': ['Portafolios'],
        'security': [{'Bearer': []}],
        'description': 'Crea nuevos ítems en el portafolio del usuario logueado. Admite múltiples ítems.',
        'parameters': [
            {
                'name': 'servicios[0][descripcion]',
                'in': 'formData',
                'type': 'string',
                'required': True,
                'description': 'Descripción del primer ítem del portafolio.'
            },
            {
                'name': 'servicios[0][imagen]',
                'in': 'formData',
                'type': 'file',
                'required': True,
                'description': 'Imagen para el primer ítem del portafolio.'
            },
            # Puedes añadir más parámetros con índices crecientes (servicios[1][descripcion], servicios[1][imagen], etc.)
            # para documentar la capacidad de enviar múltiples ítems.
            # Flasgger no soporta directamente esquemas complejos de array de objetos en formData sin un truco,
            # así que se documenta cada campo individualmente.
            {
                'name': 'servicios[1][descripcion]',
                'in': 'formData',
                'type': 'string',
                'required': False, # Opcional, para indicar que puedes añadir más
                'description': 'Descripción del segundo ítem del portafolio (ejemplo para múltiples).'
            },
            {
                'name': 'servicios[1][imagen]',
                'in': 'formData',
                'type': 'file',
                'required': False, # Opcional
                'description': 'Imagen para el segundo ítem del portafolio (ejemplo para múltiples).'
            }
        ],
        'responses': {
            '201': {
                'description': 'Ítems del portafolio creados exitosamente.',
                'schema': {
                    'type': 'array',
                    'items': {
                        'type': 'object',
                        'properties': {
                            'id_portafolio': {'type': 'integer'},
                            'descripcion': {'type': 'string'},
                            'imagenes': {'type': 'string', 'format': 'url'},
                            'usuario_cedula': {'type': 'string'}
                        }
                    }
                }
            },
            '400': {
                'description': 'No se enviaron servicios válidos para guardar.'
            },
            '404': {
                'description': 'Usuario no encontrado.'
            },
            '500': {
                'description': 'Error al crear portafolios.'
            }
        }
    })
    def post(self):
        """
        Crea nuevos ítems en el portafolio del usuario logueado.
        """
        try:
            cedula_usuario = get_jwt_identity()
            usuario = Usuario.query.get(cedula_usuario)

            if not usuario:
                return {'mensaje': 'Usuario no encontrado'}, 404

            nuevos_portafolios = []
            index = 0
            
            while True:
                descripcion = request.form.get(f'servicios[{index}][descripcion]')
                imagen = request.files.get(f'servicios[{index}][imagen]')

                if not descripcion or not imagen:
                    break

                resultado = cloudinary.uploader.upload(imagen)
                url_imagen = resultado.get('secure_url')

                nuevo_portafolio = Portafolio(
                    descripcion=descripcion,
                    imagenes=url_imagen,
                    usuario_cedula=cedula_usuario
                )
                db.session.add(nuevo_portafolio)
                nuevos_portafolios.append(nuevo_portafolio)
                index += 1

            if not nuevos_portafolios:
                return {'mensaje': 'No se enviaron servicios válidos para guardar.'}, 400

            db.session.commit()
            return portafolios_schema.dump(nuevos_portafolios), 201

        except Exception as e:
            db.session.rollback()
            return {'mensaje': f'Error al crear portafolios: {str(e)}'}, 500


class VistaPortafolioDetalle(Resource):
    @jwt_required()
    @swag_from({
        'tags': ['Portafolios'],
        'security': [{'Bearer': []}],
        'parameters': [
            {
                'name': 'id_portafolio',
                'in': 'path',
                'type': 'integer',
                'required': True,
                'description': 'ID del ítem del portafolio a eliminar.'
            }
        ],
        'responses': {
            '200': {
                'description': 'Ítem del portafolio eliminado correctamente.'
            },
            '404': {
                'description': 'Portafolio no encontrado (o no pertenece al usuario logueado).'
            },
            '500': {
                'description': 'Error al eliminar portafolio.'
            }
        }
    })
    def delete(self, id_portafolio):
        try:
            cedula_usuario = get_jwt_identity()
            portafolio = Portafolio.query.filter_by(
                id_portafolio=id_portafolio,
                usuario_cedula=cedula_usuario
            ).first()
            
            if not portafolio:
                return {'mensaje': 'Portafolio no encontrado'}, 404
                
            # Borrar la imagen de Cloudinary antes de eliminar el registro de la base de datos
            if portafolio.imagenes:
                public_id_to_delete = _extract_public_id(portafolio.imagenes)
                if public_id_to_delete:
                    try:
                        cloudinary.uploader.destroy(public_id_to_delete)
                        print(f"Imagen de portafolio {public_id_to_delete} eliminada de Cloudinary.")
                    except Exception as e:
                        print(f"Error al eliminar imagen de Cloudinary: {e}")

            db.session.delete(portafolio)
            db.session.commit()
            return {'mensaje': 'Portafolio eliminado correctamente'}, 200
            
        except Exception as e:
            db.session.rollback()
            return {'mensaje': f'Error al eliminar portafolio: {str(e)}'}, 500
