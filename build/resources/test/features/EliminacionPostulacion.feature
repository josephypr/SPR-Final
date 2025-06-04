# language: es
# author:


Característica: Eliminar postulacion de servicio
  Como usuario postulado en un servicio
  Quiero poder eliminar la postulacion previamente hecha
  Para dejar de tener servicios postulados.

  Antecedentes:
    Dado que el usuario se encuentra en la pagina de inicio de sesion de SPR como prestador
    Cuando ingrese las credenciales correctas con el rol de prestador (usuario y contrasena)
      | rol | usuarios | clave |
      |Prestador | ariana@gmail.com   | 1234567  |


  @Eliminar
  Escenario: Eliminar postulacion exitosamente
    Cuando el usuario se encuentre postulado en un servicio y quiera eliminarlo podra hacerlo oprimiendo el boton de eliminar
    Entonces ya no tendra ese servicio en el que se habia postulado
