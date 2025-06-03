#language:es
  #author:JosephPrieto
Característica: Visualizar el Perfil De Prestador
  Como usuario de SPR
  Quiero visualizar mi perfil de Prestador
  Para saber toda mi informacion personal

  Antecedentes:
    Dado que el usuario se encuentra en la pagina de inicio de sesion de SPR de prestador
    Cuando ingrese las credenciales correctas (usuario y contrasena)
      | rol | usuarios | clave |
      |Prestador | joseph@gmail.com   | 123456  |

  @PerfilPrestador
  Escenario: Visualizar el perfil exitosamente en spr
    Cuando vaya al apartado de usuario y seleccione la opcion de perfil
    Entonces el usuario podra visualizar toda su informacion personal y opciones como eliminar cuenta, actualizar datos y regresar al incio de spr.