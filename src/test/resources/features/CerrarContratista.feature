#language:es
  #author:IsabellaRamirez
Característica: Cerrar sesion del contratista
  Como usuario autenticado en la pagina SPR
  Quiero poder cerrar sesion
  Para tener mis datos seguros

  Antecedentes:
    Dado que el usuario se encuentra en la pagina de inicio de sesion de SPR
    Cuando ingrese las credenciales correctas (usuario y contrasena)
      | rol | usuarios | clave |
      |Contratista | isabella@gmail.com    | 12345678   |

    @CerrarSesion
    Escenario: Cerrar sesion correctamente
      Cuando el usuario se dirija al boton de perfil debera seleccionar la opcion de cerrar perfil
      Entonces se cerrara correctamente su perfil