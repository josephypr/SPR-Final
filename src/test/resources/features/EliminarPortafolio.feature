# language: es
# author: Josephprieto


Característica: Eliminación del portafolio del perfil de prestador de SPR
  Como usuario prestador registrado en SPR
  Quiero eliminar mi portafolio permanentemente
  Para dejar de mostrar trabajos realizado

  Antecedentes:
    Dado que el usuario se encuentra en la pagina de inicio de sesion de SPR
    Cuando ingrese las credenciales correctas (usuario y contrasena)
      | rol | usuarios | clave |
      |Contratista | isabella@gmail.com    | 12345678   |


  @Eliminar
  Escenario: Eliminar portafolio del prestador exitosamente
    Cuando el usuario prestador se  encuentre en su portafolio
    Entonces visualizara y dara click en un boton para eliminar su trabajo, el sistema muestra un mensaje de éxito, cierra la imagen del portafolio de forma exitosa

