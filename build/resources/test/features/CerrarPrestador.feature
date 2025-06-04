#language:es
#author:JosephPrieto
Característica: Finalizar sesión del prestador
  Como prestador registrado en la plataforma SPR
  Deseo cerrar mi sesión
  Para proteger mi información personal

  Antecedentes:
    Dado que el usuario se encuentra en la pagina de inicio de sesion de SPR como prestador
    Cuando ingrese las credenciales correctas con el rol de prestador (usuario y contrasena)
      | rol | usuarios | clave |
      |Prestador | ariana@gmail.com   | 1234567  |

  @CerrarSesion
  Escenario: Finalizar sesión exitosamente
    Cuando el prestador accede al oprima el boton usuario y seleccione la opción para salir de la cuenta
    Entonces su sesión se cerrará de forma satisfactoria y regresara al inicio de spr
