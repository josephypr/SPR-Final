# language: es
# author:


Característica: Eliminación de perfil de SPR
  Como usuario postulado en un servicio
  Quiero poder eliminar la postulacion previamente hecha
  Para dejar de tener servicios postulados.

  Antecedentes:
    Dado que el usuario se encuentra en la pagina de inicio de sesion de SPR como prestador
    Cuando ingrese las credenciales correctas (usuario y contrasena)
      | rol | usuarios | clave |
      |Prestador | andrey10santa@gmail.com  | 123456 |
    Y Cuando el usuario oprima el campo de postularse debe oprimir el campo de eliminar postulacion

  @Eliminar
  Escenario: Eliminar postulacion exitosamente
    Cuando el usuario se encuentre postulado en un servicio
    Entonces visualizara y dara click en un boton para eliminar su postulacion el sistema eliminara su postulacion con exito
