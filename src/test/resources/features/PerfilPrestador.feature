#language:es
  #author:JosephPrieto
Característica: Visualizar el Perfil De Prestador con exito
  Como usuario de SPR
  Quiero visualizar mi perfil de Prestador
  Para mantener actualiazada toda mi informacion personal

  Antecedentes:
    Dado que el usuario se encuentra en la pagina de inicio de sesion de SPR como prestador
    Cuando ingrese las credenciales correctas con el rol de prestador (usuario y contrasena)
      | rol | usuarios | clave |
      |Prestador | ariana@gmail.com   | 1234567  |

  @PerfilPrestador
  Escenario: Visualizar el perfil de prestador exitosamente en spr
    Cuando el usuario vaya al boton de usuario y seleccione la opcion de perfil
    Entonces el usuario podra visualizar toda su informacion personal y opciones como eliminar cuenta, actualizar datos y regresar al incio de spr.