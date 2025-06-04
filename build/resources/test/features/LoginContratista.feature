#language:es
  #author:IsabellaRamirez

Característica: Autenticacion en la pagina de SPR
  Como usuario de SPR
  Quiero autenticarme en el portal de SPR
  Para poder acceder al contenido y funcionalidades disponibles en mi cuenta.

  @Autenticacion

  Escenario: Verificar la autenticacion exitosa en la pagina de SPR
    Dado que el usuario se encuentra en la pagina de inicio de sesion de SPR
    Cuando ingrese las credenciales correctas (usuario y contrasena)
      | rol         | usuarios           | clave    |
      | Contratista | isabella@gmail.com | 12345678 |
    Entonces se debe verificar que el usuario haya sido autenticado correctamente y redirigido a su pagina de inicio de SPR