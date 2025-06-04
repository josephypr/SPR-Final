# language: es
# author: IsabellaRamirez


Característica: Actualizar el numero registrado del contratista
  Como usuario autenticado en SPR
  Quiero actualizar mi numero telefonico
  Para mantener mi datos personales actualizados

  Antecedentes:
    Dado que el usuario se encuentra en la pagina de inicio de sesion de SPR
    Cuando ingrese las credenciales correctas (usuario y contrasena)
      | rol        | usuarios              | clave      |
      |Contratista | isabella@gmail.com    | 12345678   |

  @Actualize

  Escenario: Actualizar el numero telefonico
    Cuando Cuando el usuario oprima el campo a actualizar e ingrese su numero numero telefonico
      | telefonos  |
      | 1234567890 |
    Entonces visualizara una ventana emergente que dira que los datos fueron actualizados
