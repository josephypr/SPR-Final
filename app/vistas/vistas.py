import datetime
from flask_restful import Resource
from flask import request 
from ..modelo import db, Usuario, UsuarioSchema, Mensajes, MensajesSchema, Categoria, CategoriasSchema, Rol, CalificacionSchema, Calificacion, Portafolio, PortafolioSchema
from flask_jwt_extended import get_jwt_identity, jwt_required, create_access_token
from cloudinary.uploader import upload
from werkzeug.utils import secure_filename
import cloudinary.uploader
portafolio_schema = PortafolioSchema()
portafolios_schema = PortafolioSchema(many=True)
usuario_schema = UsuarioSchema()
mensajes_schema = MensajesSchema
calificaciones_schema = CalificacionSchema
from werkzeug.utils import secure_filename
import cloudinary.uploader


class VistaContratista(Resource):
    @jwt_required()
    def get(self, cedula):
        contratista = Usuario.query.get(cedula)
        if contratista is None:
            return {'mensaje': 'Contratista no encontrado'}, 404

        fecha_nacimiento_str = contratista.fecha_nacimiento.strftime('%Y-%m-%d') if contratista.fecha_nacimiento else None

        contratista_data = {
            "cedula": contratista.cedula,
            "nombres": contratista.nombres,
            "apellidos": contratista.apellidos,
            "celular": contratista.celular,
            "direccion": contratista.direccion,
            "correo": contratista.correo,
            "fecha_nacimiento": fecha_nacimiento_str,
            "foto": contratista.foto
        }
        return contratista_data, 200

    @jwt_required()
    def put(self, cedula):
        contratista = Usuario.query.get(cedula)
        if contratista is None:
            return {'mensaje': 'Contratista no encontrado'}, 404

        data = request.get_json()

        old_foto_url = contratista.foto
        old_public_id = None
        if old_foto_url:
            try:
                if 'upload/' in old_foto_url:
                    upload_index = old_foto_url.find('upload/')
                    if 'v' in old_foto_url[upload_index+7:] and old_foto_url[upload_index+7].isdigit():
                        public_id_start_index = old_foto_url.find('/', upload_index + 7) + 1
                    else:
                        public_id_start_index = upload_index + len('upload/')
                    
                    public_id_end_index = old_foto_url.rfind('.')
                    old_public_id = old_foto_url[public_id_start_index:public_id_end_index]
            except Exception as e:
                print(f"Error extrayendo public_id de la URL antigua para contratista: {e}")
                old_public_id = None

        if 'foto' in data and data['foto'] is not None:
            contratista.foto = data['foto']

        contratista.nombres = data.get("nombres", contratista.nombres)
        contratista.apellidos = data.get("apellidos", contratista.apellidos)
        contratista.correo = data.get("correo", contratista.correo)
        contratista.celular = data.get("celular", contratista.celular)
        contratista.direccion = data.get("direccion", contratista.direccion)
        
        if 'fecha_nacimiento' in data and data['fecha_nacimiento'] is not None:
            try:
                contratista.fecha_nacimiento = datetime.datetime.strptime(data['fecha_nacimiento'], '%Y-%m-%d').date()
            except ValueError:
                return {"mensaje": "Formato de fecha de nacimiento inválido. Usa YYYY-MM-DD."}, 400
        elif 'fecha_nacimiento' in data and data['fecha_nacimiento'] is None:
            contratista.fecha_nacimiento = None

        try:
            db.session.commit()

            if 'foto' in data and data['foto'] and old_foto_url and data['foto'] != old_foto_url and old_public_id:
                try:
                    cloudinary.uploader.destroy(old_public_id)
                    print(f"Imagen antigua {old_public_id} eliminada de Cloudinary (contratista).")
                except Exception as cloudinary_err:
                    print(f"Error al eliminar imagen antigua de Cloudinary (contratista): {cloudinary_err}")

            return {"mensaje": "Perfil actualizado correctamente"}, 200
        except Exception as e:
            db.session.rollback()
            print(f"Error al actualizar perfil de contratista: {e}")
            return {"mensaje": "Error interno del servidor al actualizar el perfil."}, 500

    @jwt_required()
    def delete(self, cedula):
        contratista = Usuario.query.get(cedula)
        if contratista is None:
            return {'mensaje': 'Contratista no encontrado.'}, 404
        
        if contratista.foto:
            try:
                if 'upload/' in contratista.foto:
                    upload_index = contratista.foto.find('upload/')
                    if 'v' in contratista.foto[upload_index+7:] and contratista.foto[upload_index+7].isdigit():
                        public_id_start_index = contratista.foto.find('/', upload_index + 7) + 1
                    else:
                        public_id_start_index = upload_index + len('upload/')
                    public_id_end_index = contratista.foto.rfind('.')
                    public_id_to_delete = contratista.foto[public_id_start_index:public_id_end_index]
                
                if public_id_to_delete:
                    cloudinary.uploader.destroy(public_id_to_delete)
                    print(f"Foto de contratista {public_id_to_delete} eliminada de Cloudinary al borrar el perfil.")
            except Exception as e:
                print(f"Error al eliminar foto de Cloudinary al borrar contratista: {e}")

        db.session.delete(contratista)
        db.session.commit()
        return {"mensaje": "Perfil contratista eliminado correctamente"}, 204


class VistaPrestador(Resource):
    @jwt_required()
    def get(self, cedula):
        prestador = Usuario.query.get(cedula)
        if prestador is None:
            return {'mensaje': 'Prestador no encontrado'}, 404

        fecha_nacimiento_str = prestador.fecha_nacimiento.strftime('%Y-%m-%d') if prestador.fecha_nacimiento else None

        prestador_data = {
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
        }
        return prestador_data, 200

    @jwt_required()
    def put(self, cedula):
        prestador = Usuario.query.get(cedula)
        if prestador is None:
            return {'mensaje': 'Prestador no encontrado'}, 404

        data = request.get_json()

        old_foto_url = prestador.foto
        old_public_id = None
        if old_foto_url:
            try:
                if 'upload/' in old_foto_url:
                    upload_index = old_foto_url.find('upload/')
                    if 'v' in old_foto_url[upload_index+7:] and old_foto_url[upload_index+7].isdigit():
                        public_id_start_index = old_foto_url.find('/', upload_index + 7) + 1
                    else:
                        public_id_start_index = upload_index + len('upload/')
                    
                    public_id_end_index = old_foto_url.rfind('.')
                    old_public_id = old_foto_url[public_id_start_index:public_id_end_index]
            except Exception as e:
                print(f"Error extrayendo public_id de la URL antigua para prestador: {e}")
                old_public_id = None

        if 'foto' in data and data['foto'] is not None:
            prestador.foto = data['foto']

        prestador.nombres = data.get("nombres", prestador.nombres)
        prestador.apellidos = data.get("apellidos", prestador.apellidos)
        prestador.correo = data.get("correo", prestador.correo)
        prestador.celular = data.get("celular", prestador.celular)
        prestador.direccion = data.get("direccion", prestador.direccion)
        
        if 'fecha_nacimiento' in data and data['fecha_nacimiento'] is not None:
            try:
                prestador.fecha_nacimiento = datetime.datetime.strptime(data['fecha_nacimiento'], '%Y-%m-%d').date()
            except ValueError:
                return {"mensaje": "Formato de fecha de nacimiento inválido. Usa YYYY-MM-DD."}, 400
        elif 'fecha_nacimiento' in data and data['fecha_nacimiento'] is None:
            prestador.fecha_nacimiento = None

        prestador.titulos_uni = data.get("titulos_uni", prestador.titulos_uni)
        prestador.descripcion = data.get("descripcion", prestador.descripcion)

        try:
            db.session.commit()

            if 'foto' in data and data['foto'] and old_foto_url and data['foto'] != old_foto_url and old_public_id:
                try:
                    cloudinary.uploader.destroy(old_public_id)
                    print(f"Imagen antigua {old_public_id} eliminada de Cloudinary (prestador).")
                except Exception as cloudinary_err:
                    print(f"Error al eliminar imagen antigua de Cloudinary (prestador): {cloudinary_err}")

            return {"mensaje": "Perfil actualizado correctamente"}, 200
        except Exception as e:
            db.session.rollback()
            print(f"Error al actualizar perfil de prestador: {e}")
            return {"mensaje": "Error interno del servidor al actualizar el perfil."}, 500

    @jwt_required()
    def delete(self, cedula):
        prestador = Usuario.query.get(cedula)
        if prestador is None:
            return {'mensaje': 'Prestador no encontrado.'}, 404

        if prestador.foto:
            try:
                if 'upload/' in prestador.foto:
                    upload_index = prestador.foto.find('upload/')
                    if 'v' in prestador.foto[upload_index+7:] and prestador.foto[upload_index+7].isdigit():
                        public_id_start_index = prestador.foto.find('/', upload_index + 7) + 1
                    else:
                        public_id_start_index = upload_index + len('upload/')
                    public_id_end_index = prestador.foto.rfind('.')
                    public_id_to_delete = prestador.foto[public_id_start_index:public_id_end_index]
                
                if public_id_to_delete:
                    cloudinary.uploader.destroy(public_id_to_delete)
                    print(f"Foto de prestador {public_id_to_delete} eliminada de Cloudinary al borrar el perfil.")
            except Exception as e:
                print(f"Error al eliminar foto de Cloudinary al borrar prestador: {e}")

        db.session.delete(prestador)
        db.session.commit()
        return {"mensaje": "Perfil prestador eliminado correctamente"}, 204


class VistaSignIn(Resource):
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


class Vista_Mensajeria(Resource):
    def get(self):
        return mensajes_schema.dump(Mensajes.query.all()), 200

    @jwt_required()
    def post(self):
        nuevo_mensaje = Mensajes(mensajes=request.json['mensajes'])
        db.session.add(nuevo_mensaje)
        return mensajes_schema.dump(nuevo_mensaje), 201
    
class Vista_Calificacion_Contratista(Resource):
    #ruta publica
    def get(self, cedula):
        calificaciones = Calificacion.query.filter_by(cedula = cedula).all()
        return calificaciones_schema.dump(calificaciones), 200
    
class Vista_Calificacion_Prestador(Resource):
    #ruta publica
    def get(self, cedula):
        calificaciones = Calificacion.query.filter_by(cedula = cedula).all()
        return calificaciones_schema.dump(calificaciones), 200
    
class VistaPortafolio(Resource):
    @jwt_required()
    def post(self):
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

                # Subir imagen a Cloudinary
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

            db.session.commit()
            return portafolios_schema.dump(nuevos_portafolios), 201

        except Exception as e:
            db.session.rollback()
            return {'mensaje': f'Error al crear portafolios: {str(e)}'}, 500

    @jwt_required()
    def get(self):
        try:
            cedula_usuario = get_jwt_identity()
            portafolios = Portafolio.query.filter_by(usuario_cedula=cedula_usuario).all()
            return portafolios_schema.dump(portafolios), 200
        except Exception as e:
            return {'mensaje': f'Error al obtener portafolios: {str(e)}'}, 500

class VistaPortafolioDetalle(Resource):
    @jwt_required()
    def delete(self, id_portafolio):
        try:
            cedula_usuario = get_jwt_identity()
            portafolio = Portafolio.query.filter_by(
                id_portafolio=id_portafolio,
                usuario_cedula=cedula_usuario
            ).first()
            
            if not portafolio:
                return {'mensaje': 'Portafolio no encontrado'}, 404
                
            db.session.delete(portafolio)
            db.session.commit()
            return {'mensaje': 'Portafolio eliminado correctamente'}, 200
            
        except Exception as e:
            db.session.rollback()
            return {'mensaje': f'Error al eliminar portafolio: {str(e)}'}, 500
