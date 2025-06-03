# language: es
# author: IsabellaRamirez


Característica: Eliminación de perfil de SPR
  Como usuario registrado en SPR
  Quiero eliminar mi perfil permanentemente
  Para dejar de tener acceso a la plataforma.

  Antecedentes:
    Dado que el usuario se encuentra en la pagina de inicio de sesion de SPR
    Cuando ingrese las credenciales correctas (usuario y contrasena)
      | rol | usuarios | clave |
      |Contratista | isabella@gmail.com    | 12345678   |
    Y Cuando el usuario ira al apartado de usuario y seleccionara la opcion de perfil

  @Eliminar
    Escenario: Eliminar cuenta de usuario exitosamente
    Cuando el usuario se  encuentre en su perfil
    Entonces visualizara y dara click en un boton para eliminar su cuenta el sistema muestra un mensaje de éxito, cierra la sesión automáticamente

