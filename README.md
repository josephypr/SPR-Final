## Configuración

CONSOLA BASH

1.  **Crear entorno virtual:**
     python -m venv venv

2.  **Activar el entorno virtual:**
    
    source venv/Scripts/activate
    

3.  **Verificar base de datos:**
    Asegúrate de no tener una base de datos existente que pueda interferir.

4.  **Verificar configuración de la base de datos:**
    Revisa la configuración en los archivos de configuración de la aplicación para que coincida con tu entorno local.

5.   **Instalar librerias:**
    pip install -r requirements.txt


6.  **Exportar la variable de entorno de Flask:**
    export FLASK_APP="run.py:create_app('default')"
    

7.  **Migraciones de la base de datos:**
    
    flask init
    flask migrate
    flask upgrade
    

8.  **Verificar caché:**
    (Asegúrate de limpiar cualquier caché si es necesario para probar los cambios).

## Ejecución

Para correr la aplicación:
flask run
