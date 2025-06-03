# language: es
  #Autor Isabella
Característica: Autenticacion en la pagina de Saucedemo
  Como usuario de Saucedemo
  Quiero autenticarme en el portal de Saucedemo
  Para poder acceder al contenido y funcionalidades disponibles en mi cuenta.

  @Autenticacion

  Escenario: Verificar la autenticacion exitosa en la pagina de Saucedemo
    Dado que el usuario se encuentra en la pagina de inicio de sesion de Saucedemo
    Cuando ingrese las credenciales correctas (username y password)
      | username | password |
      |standard_user| secret_sauce |
    Entonces se debe verificar que el usuario haya sido autenticado correctamente y redirigido a su pagina de inicio de Saucedemo