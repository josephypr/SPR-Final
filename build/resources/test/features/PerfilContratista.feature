#language:es
  #author:IsabellaRamirez
Característica: Visualizar el Perfil Del contratista
  Como usuario de SPR
  Quiero visualizar mi perfil
  Para poder ver toda mi informacion personal

  Antecedentes:
    Dado que el usuario se encuentra en la pagina de inicio de sesion de SPR
    Cuando ingrese las credenciales correctas (usuario y contrasena)
      | rol         | usuarios           | clave    |
      | Contratista | isabella@gmail.com | 12345678 |

    @PerfilContratista
    Escenario: Visualizar el perfil exitosamente
      Cuando el usuario ira al apartado de usuario y seleccionara la opcion de perfil
      Entonces el usuario podra visualizar toda su informacion personal y opciones como eliminar cuenta, actualizar datos y regresar al incio.