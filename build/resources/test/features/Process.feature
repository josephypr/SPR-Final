# language: es
  #Autor Isabella
Característica: Filtrado de productos después de eliminar un item del carrito
  Como usuario de saucedemo autenticado
  Quiero poder filtrar productos de la Z a la A
  Para ver el listado en orden descendente después de gestionar mi carrito

  Antecedentes:
    Dado que el usuario se encuentra en la pagina de inicio de sesion de Saucedemo
    Cuando ingrese las credenciales correctas (username y password)
      | username | password |
      |standard_user| secret_sauce |

  @agregarProductosYfiltrar
  Esquema del escenario: Agregar productos al carrito exitosamente
    Cuando Selecciona el producto de la lista
    Y lo agrega al carrito
    Y navega al carrito para eliminar el producto escogido
    Entonces Aplica el filtro "Name (Z to A)" y debera ver los productos ordenados de la Z a la A en la página principal

    Ejemplos: