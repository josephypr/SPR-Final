import datetime
from app.modelo.modelo import PostulacionServicio
from flask_restful import Resource
from flask import request, jsonify
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
    def put(self, cedula):
        # --- MEJORA DE SEGURIDAD: Un usuario solo puede editar su propio perfil ---
        current_user_cedula = get_jwt_identity()
        if str(cedula) != current_user_cedula:
            return {'mensaje': 'No autorizado para modificar este perfil'}, 403

        contratista = Usuario.query.get_or_404(cedula)
        data = request.get_json()

        old_foto_url = contratista.foto
        
        # Actualizamos todos los campos de texto
        contratista.nombres = data.get("nombres", contratista.nombres)
        contratista.apellidos = data.get("apellidos", contratista.apellidos)
        contratista.correo = data.get("correo", contratista.correo)
        contratista.celular = data.get("celular", contratista.celular)
        contratista.direccion = data.get("direccion", contratista.direccion)
        if data.get('fecha_nacimiento'):
            contratista.fecha_nacimiento = datetime.datetime.strptime(data['fecha_nacimiento'], '%Y-%m-%d').date()

        # --- LÓGICA PARA ACTUALIZAR LA FOTO ---
        if 'foto' in data and data['foto'] != old_foto_url:
            contratista.foto = data['foto']
            # Si había una foto antigua, la borramos de Cloudinary
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
    def delete(self, cedula):
        # --- MEJORA DE SEGURIDAD: Un usuario solo puede borrar su propio perfil ---
        current_user_cedula = get_jwt_identity()
        if str(cedula) != current_user_cedula:
            return {'mensaje': 'No autorizado para eliminar este perfil'}, 403

        contratista = Usuario.query.get_or_404(cedula)
        
        # --- LÓGICA PARA BORRAR LA FOTO DE CLOUDINARY ---
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
    def put(self, cedula):
        # --- MEJORA DE SEGURIDAD: Un prestador solo puede editar su propio perfil ---
        current_user_cedula = get_jwt_identity()
        if str(cedula) != current_user_cedula:
            return {'mensaje': 'No autorizado para modificar este perfil'}, 403

        prestador = Usuario.query.get_or_404(cedula)
        data = request.get_json()

        old_foto_url = prestador.foto
        
        # Actualizamos todos los campos de texto
        prestador.nombres = data.get("nombres", prestador.nombres)
        prestador.apellidos = data.get("apellidos", prestador.apellidos)
        prestador.correo = data.get("correo", prestador.correo)
        prestador.celular = data.get("celular", prestador.celular)
        prestador.direccion = data.get("direccion", prestador.direccion)
        if data.get('fecha_nacimiento'):
            prestador.fecha_nacimiento = datetime.datetime.strptime(data['fecha_nacimiento'], '%Y-%m-%d').date()
        
        # Campos específicos del prestador
        prestador.titulos_uni = data.get("titulos_uni", prestador.titulos_uni)
        prestador.descripcion = data.get("descripcion", prestador.descripcion)

        # --- LÓGICA PARA ACTUALIZAR LA FOTO ---
        if 'foto' in data and data['foto'] != old_foto_url:
            prestador.foto = data['foto']
            # Si había una foto antigua, la borramos de Cloudinary
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
    def delete(self, cedula):
        # --- MEJORA DE SEGURIDAD: Un prestador solo puede borrar su propio perfil ---
        current_user_cedula = get_jwt_identity()
        if str(cedula) != current_user_cedula:
            return {'mensaje': 'No autorizado para eliminar este perfil'}, 403

        prestador = Usuario.query.get_or_404(cedula)
        
        # --- LÓGICA PARA BORRAR LA FOTO DE CLOUDINARY ---
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




class VistaPostulaciones(Resource):
    @jwt_required()
    def get(self):
        """
        Devuelve una lista de todas las postulaciones.
        OPCIONAL: Si se pasa un 'categoria_id' como parámetro en la URL,
        filtra las postulaciones para esa categoría específica.
        Ejemplo de llamada desde el frontend: /postulaciones?categoria_id=1
        """
        try:
            # Construimos la consulta base
            query = PostulacionServicio.query

            # Verificamos si nos pasaron un filtro en la URL
            categoria_id_filtro = request.args.get('categoria_id', type=int)
            if categoria_id_filtro:
                query = query.filter_by(categoria_id=categoria_id_filtro)

            # Ordenamos y ejecutamos la consulta final
            postulaciones = query.order_by(PostulacionServicio.fecha_postulacion.desc()).all()
            
            if not postulaciones:
                return {"mensaje": "No hay postulaciones para este servicio."}, 404

            # El resto del código para formatear la respuesta se mantiene igual
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


# DESPUÉS (Mejorado)
class VistaPostulacionesPrestador(Resource):
    @jwt_required()
    def get(self):
        """
        Devuelve una lista con los detalles completos de todas las 
        postulaciones del prestador logueado.
        """
        try:
            cedula_prestador = get_jwt_identity()
            postulaciones = PostulacionServicio.query.filter_by(usuario_cedula=cedula_prestador).order_by(PostulacionServicio.fecha_postulacion.desc()).all()
            
            # Ahora creamos una lista de diccionarios con toda la información necesaria
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
    def delete(self, id_postulacion):
        
        try:
            # 1. Obtener la identidad del usuario que hace la petición desde el token
            cedula_usuario = get_jwt_identity()
            
            # 2. Buscar la postulación por su ID. Si no la encuentra, devuelve un error 404.
            postulacion = PostulacionServicio.query.get_or_404(id_postulacion)

            # 3. VERIFICACIÓN DE SEGURIDAD CRÍTICA: ¿Es este usuario el dueño de la postulación?
            if str(postulacion.usuario_cedula) != cedula_usuario:
                # Si no es el dueño, se le niega el permiso.
                return {'mensaje': 'No tiene permiso para eliminar esta postulación'}, 403

            # 4. Si la verificación es exitosa, proceder a eliminar
            db.session.delete(postulacion)
            db.session.commit()
            
            return {'mensaje': 'Postulación eliminada correctamente'}, 200

        except Exception as e:
            db.session.rollback()
            return {'mensaje': f'Error al eliminar la postulación: {str(e)}'}, 500
        
    @jwt_required()
    def get(self, cedula=None):
        """
        Si se provee una cédula, devuelve el portafolio público de ese usuario.
        Si no se provee una cédula, devuelve el portafolio del usuario logueado.
        """
        try:
            target_cedula = None
            if cedula:
                # Si estamos viendo el portafolio de alguien más
                target_cedula = cedula
            else:
                # Si estamos viendo nuestro propio portafolio
                target_cedula = get_jwt_identity()

            if not target_cedula:
                return {'mensaje': 'No se especificó un usuario'}, 400

            portafolios = Portafolio.query.filter_by(usuario_cedula=target_cedula).all()
            
            # Es importante devolver una lista vacía si no hay nada, no un 404
            return portafolios_schema.dump(portafolios), 200
        
        except Exception as e:
            return {'mensaje': f'Error al obtener portafolios: {str(e)}'}, 500



class VistaCategorias(Resource):
    @jwt_required()
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
    
# En tu archivo de vistas (vistas.py)

class VistaPortafolio(Resource):
    @jwt_required()
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
            # Es crucial que aquí uses el schema con many=True
            return portafolios_schema.dump(portafolios), 200 
        
        except Exception as e:
            return {'mensaje': f'Error al obtener portafolios: {str(e)}'}, 500
        
    @jwt_required()
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

    # El segundo método get() fue ELIMINADO.


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
