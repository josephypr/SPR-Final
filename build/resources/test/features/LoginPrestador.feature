#language:es
  #author:JosephPrieto

Característica: Autenticacion en la pagina de SPR como prestador
  Como prestador de SPR
  Quiero autenticarme como prestador en el portal de SPR
  Para poder acceder al contenido y funcionalidades disponibles en mi cuenta de prestador

  @Autenticacion2

  Escenario: Verificar la autenticacion exitosa en la pagina de SPR como prestador
    Dado que el usuario se encuentra en la pagina de inicio de sesion de SPR como prestador
    Cuando ingrese las credenciales correctas con el rol de prestador (usuario y contrasena)
      | rol | usuarios | clave |
      |Prestador | ariana@gmail.com   | 1234567  |
    Entonces se debe verificar que el prestador haya sido autenticado correctamente y redirigido a su pagina de inicio de SPR