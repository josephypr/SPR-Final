#language:es
#author:JosephPrieto
Característica: Finalizar sesión del prestador
  Como prestador registrado en la plataforma SPR
  Deseo cerrar mi sesión
  Para proteger mi información personal

  Antecedentes:
    Dado que el prestador ha accedido a la pantalla de inicio de sesión de SPR
    Cuando introduce las credenciales válidas (usuario y contrasena)
      | rol      | usuarios           | clave   |
      |Prestador | joseph@gmail.com   | 123456  |

  @CerrarSesion
  Escenario: Finalizar sesión exitosamente
    Cuando el prestador accede al ícono de perfil y elige la opción para salir de la cuenta
    Entonces su sesión se cerrará de forma satisfactoria
