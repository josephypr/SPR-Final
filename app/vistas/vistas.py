import datetime
from flask_restful import Resource
from flask import request 
from ..modelo import db, Usuario, UsuarioSchema, Mensajes, MensajesSchema, Categoria, CategoriasSchema, Rol
from flask_jwt_extended import get_jwt_identity, jwt_required, create_access_token
from cloudinary.uploader import upload
usuario_schema = UsuarioSchema()
mensajes_schema = MensajesSchema

class VistaContratista(Resource):
    @jwt_required()
    def get(self, cedula):
        contratista = Usuario.query.get_or_404(cedula)
        if contratista is None:
            return {'mensaje': 'Contratista no encontrado'}, 404

        contratista_data = {
            "nombres": contratista.nombres,
            "apellidos": contratista.apellidos,
            "celular": contratista.celular,
            "direccion": contratista.direccion,
            "correo": contratista.correo,
            "fecha_nacimiento": contratista.fecha_nacimiento.strftime('%Y-%m-%d'),
            "foto": contratista.foto
        }

        return contratista_data, 200

    @jwt_required()
    def put(self, cedula):
        contratista = Usuario.query.get_or_404(cedula)
        data = request.get_json()

        contratista.nombres = data.get("nombres", contratista.nombres)
        contratista.apellidos = data.get("apellidos", contratista.apellidos)
        contratista.correo = data.get("correo", contratista.correo)
        contratista.celular = data.get("celular", contratista.celular)
        contratista.direccion = data.get("direccion", contratista.direccion)
        contratista.fecha_nacimiento = data.get("fecha_nacimiento", contratista.fecha_nacimiento)

        db.session.commit()
        return {"mensaje": "Perfil actualizado correctamente"}, 200

    @jwt_required()
    def delete(self, cedula):
        contratista = Usuario.query.get_or_404(cedula)
        db.session.delete(contratista)
        db.session.commit()
        return {"mensaje": "Perfil contratista eliminado correctamente"}, 204



class VistaPrestador(Resource):
    @jwt_required()
    def get(self, cedula):
        prestador = Usuario.query.get_or_404(cedula)
        if prestador is None:
            return {'mensaje': 'Prestador no encontrado'}, 404
        prestador_data = {
            "nombres": prestador.nombres,
            "apellidos": prestador.apellidos,
            "celular": prestador.celular,
            "direccion": prestador.direccion,
            "titulos_uni": prestador.titulos_uni,
            "descripcion": prestador.descripcion,
            "correo": prestador.correo,
            "fecha_nacimiento": prestador.fecha_nacimiento.strftime('%Y-%m-%d'),
            "foto": prestador.foto
        }
        return prestador_data, 200

    @jwt_required()
    def put(self, cedula):
        prestador = Usuario.query.get_or_404(cedula)
        data = request.get_json()

        prestador.nombres = data.get("nombres", prestador.nombres)
        prestador.apellidos = data.get("apellidos", prestador.apellidos)
        prestador.correo = data.get("correo", prestador.correo)
        prestador.celular = data.get("celular", prestador.celular)
        prestador.direccion = data.get("direccion", prestador.direccion)
        prestador.fecha_nacimiento = data.get("fecha_nacimiento", prestador.fecha_nacimiento)

        db.session.commit()
        return {"mensaje": "Perfil actualizado correctamente"}, 200

    @jwt_required()
    def delete(self, cedula):  # ← aquí en minúscula
        prestador = Usuario.query.get_or_404(cedula)
        db.session.delete(prestador)
        db.session.commit()
        return {"mensaje": "Perfil prestador eliminado correctamente"}, 204


   
class VistaSignIn(Resource):    
    def post(self):
        archivo = request.files.get('foto')  # Captura la foto
        url_imagen = None 
        if archivo:
            resultado = upload(archivo)
            url_imagen = resultado.get('secure_url')  # Obtiene la URL de Cloudinary
        
        # Validar y obtener el rol
        id_rol = request.form.get('id_rol')  # Se espera que el formulario envíe 'id_rol'
        if not id_rol:
            return {'mensaje': 'El rol es obligatorio'}, 400
        
        rol = Rol.query.filter_by(id_rol=id_rol).first()
        if not rol:
            return {'mensaje': f'El rol con id {id_rol} no existe'}, 404
        
        # Crear el nuevo usuario
        nuevo_usuario = Usuario(
            cedula=request.form['cedula'], 
            nombres=request.form['nombres'], 
            apellidos=request.form['apellidos'],            
            celular=request.form['celular'],         
            direccion=request.form['direccion'],             
            contrasena=request.form['contrasena'],             
            titulos_uni=request.form['titulos_uni'],             
            descripcion=request.form['descripcion'],             
            correo=request.form['correo'],
            fecha_nacimiento=request.form['fecha_nacimiento'],
            foto=url_imagen  # Guarda la URL en la base de datos
        )
        
        # Asignar el rol al usuario
        nuevo_usuario.rol_id = rol.id_rol
        
        # Asociar categorías, si es necesario
        categorias_datos = request.form.getlist('categoria')  # Lista de categorías
        asociar_categorias = []
        for dato in categorias_datos:
            try:
                nombre_categoria, nombre_servicio = dato.split(":")  # Separa categoría y servicio
            except ValueError:
                return {'mensaje': 'Formato de categoría inválido'}, 400
            # Busca la categoría correspondiente
            categoria = Categoria.query.filter_by(
                nombre_categoria=nombre_categoria,
                nombre_servicio=nombre_servicio
            ).first()
            if not categoria:
                return {'mensaje': f'No existe la categoría/servicio {dato}'}, 404
            asociar_categorias.append(categoria)
        
        nuevo_usuario.categorias.extend(asociar_categorias)
        
        # Guardar el nuevo usuario en la base de datos
        db.session.add(nuevo_usuario)
        db.session.commit()

        return usuario_schema.dump(nuevo_usuario), 201


class VistaLogin(Resource):
    
    def post(self):
        u_correo = request.json["correo"]    
        u_contrasena = request.json["contrasena"]
        usuario = Usuario.query.filter_by(correo = u_correo).first()
        if usuario and usuario.verificar_contrasena(u_contrasena):
            token_de_acceso = create_access_token(identity=str(usuario.cedula)) #se generaq el token
            return { 'mensaje' : 'inicio de sesion exitoso', 'token_de_acceso': token_de_acceso}, 200
        else:
            return {'mensaje' : 'nombre de usuario o contraseña incorrectos, por favor intente de nuevo'}, 401
        
    @jwt_required()
    def put(self, cedula):

        usuario = Usuario.query.get_or_404(cedula) #busca el usuario
        archivo = request.files.get('foto')
        if archivo:
            resultado =upload(archivo)
            url_imagen = resultado.get('secure_url')
            usuario.foto = url_imagen
        usuario.nombres = request.form.get('nombres', usuario.nombres)
        usuario.apellidos = request.form.get('apellidos', usuario.apellidos)
        usuario.celular = request.form.get('celular', usuario.celular)
        usuario.direccion = request.form.get('direccion', usuario.direccion)
        usuario.contrasena = request.form.get('contrasena', usuario.contrasena)
        usuario.titulos_uni = request.form.get('titulos_uni', usuario.titulos_uni)
        usuario.descripciom = request.form.get('descripcion', usuario.descripcion)
        usuario.correo = request.form.get('correo', usuario.correo)
        usuario.fecha_nacimiento = request.form.get('fecha_nacimiento', usuario.fecha_nacimiento)
        usuario.foto = url_imagen
        
        db.session.commit()
        return usuario_schema.dump(usuario), 200
    @jwt_required()   
    def delete(self, cedula):
        usuario = Usuario.query.get_or_404(cedula)
        db.session.delete(usuario)
        db.session.commit()
        return 'usuario eliminado exitosamente', 204
    
    
class Vista_Mensajeria(Resource):
    #ruta publica no necesita proteccion
    def get(self):
        return mensajes_schema.dump(Mensajes.query.all()), 200
    @jwt_required()
    def post(self):
        nuevo_mensaje = Mensajes(mensajes=request.json['mensajes'])
        db.session.add(nuevo_mensaje)
        return mensajes_schema.dump(nuevo_mensaje), 201