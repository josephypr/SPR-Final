from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

db = SQLAlchemy()

# Tabla intermedia: usuario - categoria
usuario_categoria = db.Table('usuario_categoria',
    db.Column('cedula', db.Integer, db.ForeignKey('usuario.cedula'), primary_key=True),
    db.Column('categoria_id', db.Integer, db.ForeignKey('categoria.id_categoria'), primary_key=True)
)

# Tabla intermedia: usuario - calificacion
usuario_calificacion = db.Table('usuario_calificacion',
    db.Column('cedula', db.Integer, db.ForeignKey('usuario.cedula'), primary_key=True),
    db.Column('id_calificacion', db.Integer, db.ForeignKey('calificacion.id_calificacion'), primary_key=True)
)

class Rol(db.Model):
    __tablename__ = 'rol'
    id_rol = db.Column(db.Integer, primary_key=True)
    rol = db.Column(db.String(200))
    usuario = db.relationship('Usuario', backref='rol')  # Relación uno a muchos

class Usuario(db.Model):
    __tablename__ = 'usuario'
    cedula = db.Column(db.Integer, primary_key=True)
    nombres = db.Column(db.String(128))
    apellidos = db.Column(db.String(128))
    celular = db.Column(db.String(10))
    direccion = db.Column(db.String(300))
    contrasena_hash = db.Column(db.String(300))
    titulos_uni = db.Column(db.String(250))
    descripcion = db.Column(db.String(500))
    correo = db.Column(db.String(200))
    fecha_nacimiento = db.Column(db.Date)
    foto = db.Column(db.String(300))
    rol_id = db.Column(db.Integer, db.ForeignKey('rol.id_rol'))
    
    portafolios = db.relationship('Portafolio', backref='usercategory')
    reservas = db.relationship('Reserva', backref='user_reserva')
    categorias = db.relationship('Categoria', secondary=usuario_categoria, backref='usuarios')
    calificaciones = db.relationship('Calificacion', secondary=usuario_calificacion, backref='usuarios')

    @property
    def contrasena(self):
        raise AttributeError("La contraseña no es un atributo legible")
    
    @contrasena.setter
    def contrasena(self, password):
        self.contrasena_hash = generate_password_hash(password)

    def verificar_contrasena(self, password):
        return check_password_hash(self.contrasena_hash, password)

class Categoria(db.Model):
    __tablename__ = 'categoria'
    id_categoria = db.Column(db.Integer, primary_key=True)
    nombre_categoria = db.Column(db.String(250))
    nombre_servicio = db.Column(db.String(250))
    mensajeria = db.relationship('Mensajes', backref='categorias_mesage')

class PostulacionServicio(db.Model):
    __tablename__ = 'postulacion_servicio'
    id_postulacion = db.Column(db.Integer, primary_key=True)
    descripcion = db.Column(db.String(500))
    whatsapp = db.Column(db.String(20))
    fecha_postulacion = db.Column(db.DateTime, server_default=db.func.now())
    usuario_cedula = db.Column(db.Integer, db.ForeignKey('usuario.cedula'), nullable=False)
    categoria_id = db.Column(db.Integer, db.ForeignKey('categoria.id_categoria'), nullable=False)

    prestador = db.relationship('Usuario', backref='postulaciones')
    categoria = db.relationship('Categoria', backref='postulaciones')

class Mensajes(db.Model):
    __tablename__ = 'mensajes'
    id_mensaje = db.Column(db.Integer, primary_key=True)
    mensajes = db.Column(db.String(500))
    id_categoria = db.Column(db.Integer, db.ForeignKey('categoria.id_categoria'))

class Portafolio(db.Model):
    __tablename__ = 'portafolios'
    id_portafolio = db.Column(db.Integer, primary_key=True)
    descripcion = db.Column(db.String(128))
    imagenes = db.Column(db.String(500))
    usuario_cedula = db.Column(db.Integer, db.ForeignKey('usuario.cedula'))

class Reserva(db.Model):
    __tablename__ = 'reserva'
    id_reserva = db.Column(db.Integer, primary_key=True)
    fecha = db.Column(db.Date)
    hora = db.Column(db.Time)
    usuario_cedula = db.Column(db.Integer, db.ForeignKey('usuario.cedula'))
    
    historial = db.relationship('Historial', uselist=False, backref='reservhis')
    estado_ser = db.relationship('Estado_ser', uselist=False, backref='reserva', passive_deletes=True)

class Historial(db.Model):
    __tablename__ = 'historial'
    id_historial = db.Column(db.Integer, primary_key=True)
    reservas = db.Column(db.Integer, db.ForeignKey('reserva.id_reserva'), unique=True)

class Calificacion(db.Model):
    __tablename__ = 'calificacion'
    id_calificacion = db.Column(db.Integer, primary_key=True)
    calificacion = db.Column(db.Integer)
    descripcion = db.Column(db.String(250))

class Estado_ser(db.Model):
    __tablename__ = 'estado_servicios'
    id_estado = db.Column(db.Integer, primary_key=True)
    estado_pago = db.Column(db.String(128))
    reporte = db.Column(db.String(128))
    estado_reserva = db.Column(db.Integer, db.ForeignKey('reserva.id_reserva'), unique=True)

# ---------------------------
# Esquemas con Marshmallow
# ---------------------------

class UsuarioSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Usuario
        include_relationships = True
        load_instance = True

class CategoriasSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Categoria
        include_relationships = True
        load_instance = True

class MensajesSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Mensajes
        include_relationships = True
        load_instance = True

class PortafolioSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Portafolio
        include_relationships = True
        load_instance = True

class ReservaSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Reserva
        include_relationships = True
        load_instance = True

class HistorialSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Historial
        include_relationships = True
        load_instance = True

class Estado_serSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Estado_ser
        include_relationships = True
        load_instance = True

class CalificacionSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Calificacion
        include_relationships = True
        load_instance = True

class PostulacionServicioSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = PostulacionServicio
        include_fk = True
        load_instance = True
