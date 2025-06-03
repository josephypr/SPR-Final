#language:es
  #author:andrey

Característica: Postulacion Del prestador en un servicio
  Como prestador de SPR
  Quiero Postularme mi perfil
  Para poder ver prestar mis servicios de mantenimientos

  Antecedentes:
    Dado que el usuario se encuentra en la pagina de inicio de sesion de SPR como prestador
    Cuando ingrese las credenciales correctas (usuario y contrasena)
      | rol | usuarios | clave |
      |Prestador | andrey10santa@gmail.com  | 123456 |
    Y Cuando el usuario oprima el campo de postularse

  @PerfilPrestador
  Escenario: postulacion de servicio exitosa
    Cuando el usuario se encuentre en home y vaya al apartado de prestador y haga click en el campo postularse
    Entonces el usuario podra visualizar toda su informacion personal en la postulacion.